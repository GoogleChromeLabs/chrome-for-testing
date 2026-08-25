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

// This script gets Chrome release version numbers per platform
// from the Chromium Dash API, figures out the most appropriate version
// number to use for bundling with Puppeteer, and prints its download
// URLs + their HTTP status codes.

import fs from 'node:fs/promises';

import { binaries, checkDownloadsForVersion } from './url-utils.mjs';
import { isOlderVersion } from './is-older-version.mjs';

const versionsToRevisions = new Map();

const findVersionForChannel = async (channel = 'Stable') => {
	const result = {
		channel,
		version: '0.0.0.0',
		revision: '0',
		ok: false,
		downloads: {},
	};
	for (const binary of binaries) {
		result.downloads[binary] = [];
	}
	console.log(`Checking the ${channel} channel…`);
	const apiEndpoint = `https://chromiumdash.appspot.com/fetch_releases?channel=${channel}&num=1&platform=Win32,Windows,Mac,Linux`;
	const response = await fetch(apiEndpoint);
	const data = await response.json();

	const versions = new Set();
	for (const entry of data) {
		const version = entry.version;
		const revision = String(entry.chromium_main_branch_position);
		versions.add(version);
		versionsToRevisions.set(version, revision);
	}

	console.log(`Found versions:`, versions);

	const sortedVersions = Array.from(versions).sort((a, b) => {
		if (isOlderVersion(a, b)) return -1;
		if (isOlderVersion(b, a)) return 1;
		return 0;
	});

	let desiredVersion = sortedVersions[0];
	let checked = null;
	for (const version of sortedVersions) {
		desiredVersion = version;
		checked = await checkDownloadsForVersion(version);
		console.log(
			`Checking version ${version}…`,
			checked.isOk ? '\u2705 OK' : '\u274C NOT OK',
		);
		if (checked.isOk) {
			break;
		}
	}
	console.log(`Recommended version for ${channel} channel:`, desiredVersion);

	result.version = desiredVersion;
	result.revision = versionsToRevisions.get(desiredVersion);

	if (checked) {
		for (const { binary, platform, url, status } of checked.downloads) {
			result.downloads[binary].push({ platform, url, status });
			console.log(url, status);
		}
		result.ok = checked.isOk;
	}

	return result;
};

const allResults = {
	timestamp: new Date().toISOString(),
	ok: false,
	channels: {},
};
const channels = ['Stable', 'Beta', 'Dev', 'Canary'];
let hasFailure = false;
for (const channel of channels) {
	const result = await findVersionForChannel(channel);
	if (!result.ok) hasFailure = true;
	allResults.channels[channel] = result;
	console.log('');
}
allResults.ok = !hasFailure;

const json = JSON.stringify(allResults, null, '\t');
await fs.writeFile('./data/dashboard.json', `${json}\n`);
