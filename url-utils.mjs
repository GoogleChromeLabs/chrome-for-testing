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
]);

export const makeDownloadUrl = ({ version, platform, binary = 'chrome' }) => {
	assert(platforms.has(platform));
	assert(binaries.has(binary));
	const url = `https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/${version}/${platform}/${binary}-${platform}.zip`;
	return url;
};
