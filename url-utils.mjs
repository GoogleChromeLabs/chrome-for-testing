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

import assert from 'node:assert';

import {
	predatesChromeDriverAvailability,
	predatesChromeHeadlessShellAvailability,
	predatesMojoJsAvailability,
} from './is-older-version.mjs';

// Lorry download bucket labels.
export const platforms = new Set([
	'linux64',
	'mac-arm64',
	'mac-x64',
	'win32',
	'win64',
]);

export const binaries = new Set([
	'chrome',
	'chromedriver',
	'chrome-headless-shell',
	'mojojs',
]);

export const makeDownloadUrl = ({ version, platform, binary = 'chrome' }) => {
	assert(binaries.has(binary));
	if (binary === 'mojojs') {
		return `https://storage.googleapis.com/chrome-for-testing-public/${version}/${binary}.zip`;
	}
	assert(platforms.has(platform));
	const url = `https://storage.googleapis.com/chrome-for-testing-public/${version}/${platform}/${binary}-${platform}.zip`;
	return url;
};

export const makeDownloadsForVersion = (version) => {
	const urls = [];
	for (const binary of binaries) {
		// `mojojs.zip` is platform-agnostic.
		if (binary === 'mojojs') {
			const url = makeDownloadUrl({ version, binary });
			urls.push({ binary, url });
			continue;
		}
		// Other CfT assets are platform-specific.
		for (const platform of platforms) {
			const url = makeDownloadUrl({ version, platform, binary });
			urls.push({ binary, platform, url });
		}
	}
	return urls;
};

export const checkDownloadsForVersion = async (version) => {
	const downloads = makeDownloadsForVersion(version);

	// Add `isOk` and `status` properties.
	let hasFailure = false;
	for (const download of downloads) {
		const {binary, url} = download;
		const response = await fetch(url, { method: 'head' });
		const status = response.status;
		if (status !== 200) {
			const ignoreChromeDriver = binary === 'chromedriver' && predatesChromeDriverAvailability(version);
			const ignoreChromeHeadlessShell = binary === 'chrome-headless-shell' && predatesChromeHeadlessShellAvailability(version);
			const ignoreMojoJs = binary === 'mojojs' && predatesMojoJsAvailability(version);
			const ignore = ignoreChromeDriver || ignoreChromeHeadlessShell || ignoreMojoJs;
			if (ignore) {
				// Do not consider missing ChromeDriver, chrome-headless-shell,
				// or MojoJS assets a failure for versions predating their CfT
				// release.
			} else {
				download.isOk = false;
				hasFailure = true;
			}
		} else {
			download.isOk = true;
		}
		download.status = status;
	}
	return {
		downloads,
		isOk: !hasFailure,
	};
};
