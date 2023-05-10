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

import {binaries, platforms, makeDownloadUrl} from './url-utils.mjs';
import {isOlderVersion} from './is-older-version.mjs';

const findVersionForChannel = async (channel = 'Stable') => {
	const result = {
		channel,
		version: '0.0.0.0',
		revision: '0',
		ok: false,
		downloads: [], // {platform, url, status}
	};
	console.log(`Checking the ${channel} channel…`);
	const apiEndpoint = `https://chromiumdash.appspot.com/fetch_releases?channel=${channel}&num=1&platform=Win32,Windows,Mac,Linux`;
	const response = await fetch(apiEndpoint);
	const data = await response.json();

	let minVersion = `99999.99999.99999.99999`;
	const versions = new Set();
	let minRevision = 9999999999999999;
	for (const entry of data) {
		const version = entry.version;
		const revision = String(entry.chromium_main_branch_position);
		versions.add(version);
		if (isOlderVersion(version, minVersion)) {
			minVersion = version;
			minRevision = revision;
		}
	}

	console.log(`Found versions:`, versions);
	console.log(`Recommended version for ${channel} channel:`, minVersion);
	result.version = minVersion;
	result.revision = minRevision;

	const urls = [];
	for (const platform of platforms) {
		const url = makeDownloadUrl({
			version: minVersion,
			platform,
			binary: 'chrome',
		});
		urls.push({ platform, url });
	}

	let hasFailure = false;
	for (const { platform, url } of urls) {
		const response = await fetch(url, { method: 'head' });
		const status = response.status;
		if (status !== 200) {
			hasFailure = true;
		}
		result.downloads.push({ platform, url, status })
		console.log(url, status);
	}
	console.log(hasFailure ? '\u274C NOT OK' : '\u2705 OK');
	result.ok = !hasFailure;
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
