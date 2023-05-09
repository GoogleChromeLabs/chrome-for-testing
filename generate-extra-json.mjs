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

import fs from 'node:fs/promises';
import {binaries, platforms, makeDownloadUrl} from './url-utils.mjs';

const readJsonFile = async (filePath) => {
	const json = await fs.readFile(filePath, 'utf8');
	const data = JSON.parse(json);
	return data;
};

const writeJsonFile = async (filePath, data) => {
	const json = JSON.stringify(data, null, '\t');
	await fs.writeFile(filePath, `${json}\n`);
};

const data = await readJsonFile('./data/dashboard.json');

const prepareChannelsToVersionsData = (data) => {
	const copy = structuredClone(data);
	delete copy.ok;
	for (const channelData of Object.values(copy.channels)) {
		delete channelData.ok;
		delete channelData.downloads;
	}
	return copy;
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
		lastKnownGoodVersions.timestamp = new Date().toISOString();
		knownData.version = channelData.version;
		knownData.revision = channelData.revision;
	}
	return lastKnownGoodVersions;
};

const addDownloadsTolastKnownGoodVersionsData = (data) => {
	for (const channelData of Object.values(data.channels)) {
		const downloads = channelData.downloads = {};
		for (const binary of binaries) {
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
	return data;
};

await writeJsonFile(
	'./data/channels-to-versions.json',
	prepareChannelsToVersionsData(data)
);

const lastKnownGoodVersionsData = await prepareLastKnownGoodVersionsData(data);
await writeJsonFile(
	'./data/last-known-good-versions.json',
	lastKnownGoodVersionsData
);

await writeJsonFile(
	'./data/last-known-good-versions-with-downloads.json',
	addDownloadsTolastKnownGoodVersionsData(lastKnownGoodVersionsData)
);
