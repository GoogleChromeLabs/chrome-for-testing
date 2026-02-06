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

// Why pull in `semver.lt()` when we could instead we can have some fun?

const reVersionNumber =
	/^(?<major>\d+)\.(?<minor>\d+)\.(?<build>\d+).(?<patch>\d+)$/;

const hash = (versionNumber) => {
	// XXXXX.XXXXX.XXXXX.XXXXX
	//       00000 00000 00000
	//             00000 00000
	//                   00000
	const match = reVersionNumber.exec(versionNumber);
	const major = BigInt(match.groups.major);
	const minor = BigInt(match.groups.minor);
	const build = BigInt(match.groups.build);
	const patch = BigInt(match.groups.patch);
	// prettier-ignore
	const hashed =
		major * 1_00000_00000_00000n
		+ minor *     1_00000_00000n
		+ build *           1_00000n
		+ patch;
	return hashed;
};

export const isOlderVersion = (a, b) => {
	return hash(a) < hash(b);
};

export const predatesChromeDriverAvailability = (version) => {
	// ChromeDriver is only available via CfT from M115 onwards.
	const firstChromeDriverVersion = '115.0.5763.0';
	const predates = isOlderVersion(version, firstChromeDriverVersion);
	return predates;
};

export const predatesChromeHeadlessShellAvailability = (version) => {
	// chrome-headless-shell is only available via CfT from M120 onwards.
	const firstChromeHeadlessShellVersion = '120.0.6098.0';
	const predates = isOlderVersion(version, firstChromeHeadlessShellVersion);
	return predates;
};

export const predatesMojoJsAvailability = (version) => {
	// mojojs is only available via CfT from M123 onwards.
	const firstMojoJsVersion = '123.0.6309.0';
	const predates = isOlderVersion(version, firstMojoJsVersion);
	return predates;
};
