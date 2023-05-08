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

const json = await fs.readFile('./data/output.json', 'utf8');
const data = JSON.parse(json);

delete data.ok;
for (const channelData of Object.values(data.channels)) {
	delete channelData.ok;
	delete channelData.downloads;
}

const output = JSON.stringify(data, null, '\t');
await fs.writeFile('./data/channels-to-versions.json', `${output}\n`);
