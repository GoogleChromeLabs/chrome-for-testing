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

import {checkDownloadsForVersion} from './url-utils.mjs';

const checkVersion = async (version = '123.0.6309.0') => {
	console.log(`Checking downloads for v${version}…`);
	const checked = await checkDownloadsForVersion(version);
	for (const {url, status} of checked.downloads) {
		console.log(url, status);
	}
	console.log(checked.isOk ? '\u2705 OK' : '\u274C NOT OK');
};

const version = process.argv[2] || '123.0.6309.0';
await checkVersion(version);
