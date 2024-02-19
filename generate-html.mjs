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

import { escape as escapeHtml } from 'lodash-es';
import { minify as minifyHtml } from 'html-minifier-terser';

import {predatesChromeDriverAvailability, predatesChromeHeadlessShellAvailability} from './is-older-version.mjs';
import {readJsonFile} from './json-utils.mjs';

const OK = '\u2705';
const NOT_OK = '\u274C';

const renderDownloads = (downloads, version, forceOk = false) => {
	const list = [];
	for (const [binary, downloadsPerBinary] of Object.entries(downloads)) {
		if (binary === 'chromedriver' && predatesChromeDriverAvailability(version)) {
			continue;
		}
		if (binary === 'chrome-headless-shell' && predatesChromeHeadlessShellAvailability(version)) {
			continue;
		}
		if (binary === 'mojojs') {
			// Exclude mojojs from the dashboard + API.
			continue;
		}
		for (const download of downloadsPerBinary) {
			list.push(
				`<tr class="status-${
					(forceOk || download.status === 200) ? 'ok' : 'not-ok'
				}"><th><code>${escapeHtml(
					binary
				)}</code><th><code>${escapeHtml(
					download.platform
				)}</code><td><code>${escapeHtml(
					download.url
				)}</code><td><code>${forceOk ? '200' : escapeHtml(download.status)}</code>`
			);
		}
	}
	return `
		<div class="table-wrapper">
			<table>
				<thead>
					<tr>
						<th>Binary
						<th>Platform
						<th>URL
						<th>HTTP status
				<tbody>
					${list.join('')}
			</table>
		</div>
	`;
};

const render = (data) => {
	const summary = [];
	const main = [];
	for (const [channel, channelData] of Object.entries(data.channels)) {
		const { version, revision, downloads } = channelData;
		const isOk = channelData.ok;
		if (isOk) {
			summary.push(`
				<tr class="status-ok">
					<th><a href="#${escapeHtml(channel.toLowerCase())}">${escapeHtml(channel)}</a>
					<td><code>${escapeHtml(version)}</code>
					<td><code>r${escapeHtml(revision)}</code>
					<td>${ OK }
			`);
		} else {
			const fallbackData = lastKnownGoodVersions.channels[channel];
			const fallbackVersion = fallbackData.version;
			const fallbackRevision = fallbackData.revision;
			summary.push(`
				<tr class="status-ok">
					<th><a href="#${escapeHtml(channel.toLowerCase())}">${escapeHtml(channel)}</a>
					<td><code>${escapeHtml(fallbackVersion)}</code>
					<td><code>r${escapeHtml(fallbackRevision)}</code>
					<td>${ OK }
				<tr class="status-upcoming">
					<th><a href="#${escapeHtml(channel.toLowerCase())}">${escapeHtml(channel)} (upcoming)</a>
					<td><code>${escapeHtml(version)}</code>
					<td><code>r${escapeHtml(revision)}</code>
					<td>${ NOT_OK }
			`);
		}
		main.push(`
			<section id="${escapeHtml(channel.toLowerCase())}" class="status-${
			isOk ? 'ok' : 'not-ok'
		}">
			`);
		if (isOk) {
			main.push(`
				<h2>${escapeHtml(channel)}</h2>
				<p>Version: <code>${escapeHtml(version)}</code> (<code>r${escapeHtml(revision)}</code>)</p>
				${renderDownloads(downloads, version)}
			`);
		} else {
			const fallbackChannelData = lastKnownGoodVersions.channels[channel];
			const fallbackVersion = fallbackChannelData.version;
			const fallbackRevision = fallbackChannelData.revision;
			const fallbackDownloads = fallbackChannelData.downloads;
			main.push(`
				<h2>${escapeHtml(channel)}</h2>
				<p>Version: <code>${escapeHtml(fallbackVersion)}</code> (<code>r${escapeHtml(fallbackRevision)}</code>)</p>
				${renderDownloads(fallbackDownloads, fallbackVersion, true)}
				<p>Upcoming version: <code>${escapeHtml(version)}</code> (<code>r${escapeHtml(revision)}</code>)</p>
				${renderDownloads(downloads, version)}
			`);
		}
		main.push(`
			</section>
		`);
	}
	return `
		<div class="table-wrapper summary">
			<table>
				<thead>
					<tr>
						<th>Channel
						<th>Version
						<th>Revision
						<th>Status
				<tbody>
					${summary.join('')}
			</table>
		</div>

		${main.join('')}
	`;
};

const data = await readJsonFile('./data/dashboard.json');
const lastKnownGoodVersions = await readJsonFile('data/last-known-good-versions-with-downloads.json');

const htmlTemplate = await fs.readFile('./_tpl/template.html', 'utf8');
const html = htmlTemplate.toString()
	.replace('%%%DATA%%%', render(data))
	.replace('%%%TIMESTAMP%%%', data.timestamp);
const minifiedHtml = await minifyHtml(html, {
	collapseBooleanAttributes: true,
	collapseInlineTagWhitespace: false,
	collapseWhitespace: true,
	conservativeCollapse: false,
	decodeEntities: true,
	html5: true,
	includeAutoGeneratedTags: false,
	minifyCSS: true,
	minifyJS: true,
	preserveLineBreaks: false,
	preventAttributesEscaping: true,
	removeAttributeQuotes: true,
	removeComments: true,
	removeEmptyAttributes: true,
	removeEmptyElements: false,
	removeOptionalTags: false,
	removeRedundantAttributes: true,
	removeTagWhitespace: false,
	sortAttributes: true,
	sortClassName: true,
});
await fs.writeFile('./dist/index.html', minifiedHtml);
