/**
 * Copyright 2024 Google LLC
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

import {glob} from 'glob';

import {escapeHtml, minifyHtml} from './html-utils.mjs';

const files = await glob('./*', {
	cwd: './dist/',
});

const results = {
	digit: [],
	json: [],
	capOnly: [],
	cap: [],
	other: [],
};
for (const fileName of files) {
	if (/^\d/.test(fileName)) {
		results.digit.push(fileName);
		continue;
	}
	if (fileName.endsWith('.json')) {
		results.json.push(fileName);
		continue;
	}
	if (/^[A-Z_]+$/.test(fileName)) {
		results.capOnly.push(fileName);
		continue;
	}
	if (/^[A-Z]/.test(fileName)) {
		results.cap.push(fileName);
		continue;
	}
	results.other.push(fileName);
}

results.digit.sort();
results.json.sort();
results.capOnly.sort();
results.cap.sort();
results.other.sort();

const allFileNames = [
	...results.json,
	...results.capOnly,
	...results.cap,
	...results.digit,
	...results.other,
];

const html = `
<!DOCTYPE html>
<html lang="en">
<meta charset="utf-8">
<title>Chrome for Testing dashboard + API directory listing</title>
<meta name="viewport" content="width=device-width">
<meta name="robots" content="noindex">
<style>
	html { font: 1rem/1.6 sans-serif; }
	a { display: block; }
</style>
<ul>
${allFileNames.map(fileName => {
	return `<li><a href="${escapeHtml(fileName)}"><code>${escapeHtml(fileName)}</code></a>`;
}).join('\n')}
</ul>
`;
const minified = await minifyHtml(html);
await fs.writeFile('./files.html', minified);
