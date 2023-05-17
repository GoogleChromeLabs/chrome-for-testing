/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the “License”);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {binaries, platforms, makeDownloadUrl} from './url-utils.mjs';
import {isOlderVersion, predatesChromeDriverAvailability} from './is-older-version.mjs';
import {readJsonFile, writeJsonFile} from './json-utils.mjs';

const createTimestamp = () => {
	return new Date().toISOString();
};

const prepareLastKnownGoodVersionsData = async (data) => {
	const lastKnownGoodVersions = await readJsonFile('./data/last-known-good-versions.json');
	for (const channelData of Object.values(data.channels)) {
		if (!channelData.ok) continue;
		const channelName = channelData.channel;
		const knownData = lastKnownGoodVersions.channels[channelName];
		if (
			knownData.version === channelData.version &&
			knownData.revision === channelData.revision
		) {
			continue;
		}
		lastKnownGoodVersions.timestamp = createTimestamp();
		knownData.version = channelData.version;
		knownData.revision = channelData.revision;
	}
	return lastKnownGoodVersions;
};

const updateKnownGoodVersions = async (filePath, lastKnownGoodVersions) => {
	const knownGoodVersions = await readJsonFile(filePath);
	const set = new Set();
	const versions = knownGoodVersions.versions;
	for (const entry of versions) {
		set.add(entry.version);
	}
	for (const entry of Object.values(lastKnownGoodVersions.channels)) {
		const {version, revision} = entry;
		if (set.has(version)) {
			continue;
		}
		versions.push({
			version,
			revision,
		});
		knownGoodVersions.timestamp = createTimestamp();
	}
	knownGoodVersions.versions.sort((a, b) => {
		if (isOlderVersion(a.version, b.version)) return -1;
		if (a.version === b.version) return 0; // This cannot happen.
		return 1;
	});
	await writeJsonFile(filePath, knownGoodVersions);
	return knownGoodVersions;
};

const addDownloads = (data, key) => {
	const copy = structuredClone(data);
	for (const channelData of Object.values(copy[key])) {
		const downloads = channelData.downloads = {};
		for (const binary of binaries) {
			// TODO: Remove this once M115 hits Stable and we no longer need
			// this special case.
			if (binary === 'chromedriver' && predatesChromeDriverAvailability(channelData.version)) {
				continue;
			}
			const downloadsForThisBinary = downloads[binary] = [];
			for (const platform of platforms) {
				const url = makeDownloadUrl({
					version: channelData.version,
					platform: platform,
					binary: binary,
				});
				downloadsForThisBinary.push({
					platform: platform,
					url: url,
				});
			}
		}
	}
	return copy;
};

const updateLatestVersionsPerMilestone = async (filePath, lastKnownGoodVersionsData) => {
	const latestVersionsPerMilestoneData = await readJsonFile(filePath);
	const milestones = latestVersionsPerMilestoneData.milestones;
	let needsUpdate = false;

	for (const channelData of Object.values(lastKnownGoodVersionsData.channels)) {
		const {version, revision} = channelData;
		const milestone = version.split('.')[0];
		if (Object.hasOwn(milestones, milestone)) {
			const current = milestones[milestone];
			if (isOlderVersion(current.version, version)) {
				needsUpdate = true;
				current.version = version;
				current.revision = revision;
			}
		} else {
			needsUpdate = true;
			milestones[milestone] = {
				milestone,
				version,
				revision,
			};
		}
	}

	if (needsUpdate) {
		latestVersionsPerMilestoneData.timestamp = createTimestamp();
	}

	await writeJsonFile(filePath, latestVersionsPerMilestoneData);
	return latestVersionsPerMilestoneData;
};

const DASHBOARD_DATA = await readJsonFile('./data/dashboard.json');

const lastKnownGoodVersionsData = await prepareLastKnownGoodVersionsData(DASHBOARD_DATA);
await writeJsonFile(
	'./data/last-known-good-versions.json',
	lastKnownGoodVersionsData
);

await writeJsonFile(
	'./data/last-known-good-versions-with-downloads.json',
	addDownloads(lastKnownGoodVersionsData, 'channels')
);

const latestVersionsPerMilestone = await updateLatestVersionsPerMilestone('./data/latest-versions-per-milestone.json', lastKnownGoodVersionsData);

await writeJsonFile(
	'./data/latest-versions-per-milestone-with-downloads.json',
	addDownloads(latestVersionsPerMilestone, 'milestones')
);

const knownGoodVersions = await updateKnownGoodVersions('./data/known-good-versions.json', lastKnownGoodVersionsData);

await writeJsonFile(
	'./data/known-good-versions-with-downloads.json',
	addDownloads(knownGoodVersions, 'versions')
);
