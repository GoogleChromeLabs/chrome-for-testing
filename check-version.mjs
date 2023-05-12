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
// from the Chromium Dash API, and then prints the corresponding
// Chrome for Testing download URLs + their HTTP status codes.

import {binaries, platforms, makeDownloadUrl} from './url-utils.mjs';
import {predatesChromeDriverAvailability} from './is-older-version.mjs';

const checkVersion = async (version = '113.0.5672.32') => {
	console.log(`Checking downloads for v${version}…`);

	const urls = [];
	for (const binary of binaries) {
		for (const platform of platforms) {
			const url = makeDownloadUrl({ version, platform, binary });
			urls.push({ binary, url });
		}
	}

	let hasFailure = false;
	for (const {binary, url} of urls) {
		const response = await fetch(url, { method: 'head' });
		const status = response.status;
		if (status !== 200) {
			// ChromeDriver is only available via CfT from M115 onwards.
			const ignoreChromeDriver = predatesChromeDriverAvailability(version);
			if (binary === 'chromedriver' && ignoreChromeDriver) {
				// Do not consider missing ChromeDriver assets a failure for
				// versions prior to M115.
			} else {
				hasFailure = true;
			}
		}
		console.log(url, status);
	}
	console.log(hasFailure ? '\u274C NOT OK' : '\u2705 OK');
};

const version = process.argv[2] || '113.0.5672.32';
await checkVersion(version);
