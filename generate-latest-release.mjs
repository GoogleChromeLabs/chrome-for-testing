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

import { readJsonFile } from './json-utils.mjs';

const prepareMajorFiles = async () => {
	const data = await readJsonFile('./data/latest-versions-per-milestone.json');
	for (const [milestone, versionData] of Object.entries(data.milestones)) {
		const fileName = `./dist/LATEST_RELEASE_${milestone}`;
		const contents = versionData.version;
		await fs.writeFile(fileName, contents);
	}
};

const prepareMajorMinorBuildFiles = async () => {
	const data = await readJsonFile(
		'./data/latest-patch-versions-per-build.json',
	);
	for (const [build, versionData] of Object.entries(data.builds)) {
		const fileName = `./dist/LATEST_RELEASE_${build}`;
		const contents = versionData.version;
		await fs.writeFile(fileName, contents);
	}
};

const prepareChannelFiles = async () => {
	const data = await readJsonFile('./data/last-known-good-versions.json');
	for (const [channelName, channelData] of Object.entries(data.channels)) {
		const fileName = `./dist/LATEST_RELEASE_${channelName.toUpperCase()}`;
		const contents = channelData.version;
		await fs.writeFile(fileName, contents);
	}
};

await prepareMajorFiles();
await prepareMajorMinorBuildFiles();
await prepareChannelFiles();
