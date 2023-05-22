# Chrome for Testing availability

## JSON API endpoints

| Endpoint                                                                                                                                                         | Description                                                                                                                          |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| [`known-good-versions.json`](https://googlechromelabs.github.io/chrome-for-testing/known-good-versions.json)                                                     | The versions for which all CfT assets are available for download. Useful for bisecting.                                              |
| [`known-good-versions-with-downloads.json`](https://googlechromelabs.github.io/chrome-for-testing/known-good-versions-with-downloads.json)                       | Same as above, but with an extra `downloads` property for each version, listing the full download URLs per asset.                    |
| [`last-known-good-versions.json`](https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions.json)                                           | The latest versions for which all CfT assets are available for download, for each Chrome release channel (Stable/Beta/Dev/Canary).   |
| [`last-known-good-versions-with-downloads.json`](https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions-with-downloads.json)             | Same as above, but with an extra `downloads` property for each channel, listing the full download URLs per asset.                    |
| [`latest-patch-versions-per-build.json`](https://googlechromelabs.github.io/chrome-for-testing/latest-patch-versions-per-build.json)                             | The latest versions for which all CfT assets are available for download, for each known combination of `MAJOR.MINOR.BUILD` versions. |
| [`latest-patch-versions-per-build-with-downloads.json`](https://googlechromelabs.github.io/chrome-for-testing/latest-versions-per-milestone-with-downloads.json) | Same as above, but with an extra `downloads` property for each version, listing the full download URLs per asset.                    |
| [`latest-versions-per-milestone.json`](https://googlechromelabs.github.io/chrome-for-testing/latest-versions-per-milestone.json)                                 | The latest versions for which all CfT assets are available for download, for each Chrome milestone.                                  |
| [`latest-versions-per-milestone-with-downloads.json`](https://googlechromelabs.github.io/chrome-for-testing/latest-versions-per-milestone-with-downloads.json)   | Same as above, but with an extra `downloads` property for each milestone, listing the full download URLs per asset.                  |

The set of “all CfT assets” for a given Chrome version is a matrix of supported binaries × platforms.

The current list of supported binaries is:

- `chrome` a.k.a. Chrome for Testing
- `chromedriver` (supported since v115.0.5763.0)

The current list of supported platforms is:

- `linux64`
- `mac-arm64`
- `mac-x64`
- `win32`
- `win64`

## CLI utilities

### Find the latest Chrome versions across channels

```
$ npm run find

> find
> node --no-warnings find-version.mjs

Checking the Stable channel…
Found versions: Set(2) { '113.0.5672.93', '113.0.5672.92' }
Recommended version for Stable channel: 113.0.5672.92
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/113.0.5672.92/linux64/chrome-linux64.zip 404
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/113.0.5672.92/mac-arm64/chrome-mac-arm64.zip 404
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/113.0.5672.92/mac-x64/chrome-mac-x64.zip 404
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/113.0.5672.92/win32/chrome-win32.zip 404
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/113.0.5672.92/win64/chrome-win64.zip 404
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/113.0.5672.92/linux64/chromedriver-linux64.zip 404
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/113.0.5672.92/mac-arm64/chromedriver-mac-arm64.zip 404
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/113.0.5672.92/mac-x64/chromedriver-mac-x64.zip 404
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/113.0.5672.92/win32/chromedriver-win32.zip 404
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/113.0.5672.92/win64/chromedriver-win64.zip 404
❌ NOT OK

Checking the Beta channel…
Found versions: Set(1) { '114.0.5735.26' }
Recommended version for Beta channel: 114.0.5735.26
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/114.0.5735.26/linux64/chrome-linux64.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/114.0.5735.26/mac-arm64/chrome-mac-arm64.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/114.0.5735.26/mac-x64/chrome-mac-x64.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/114.0.5735.26/win32/chrome-win32.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/114.0.5735.26/win64/chrome-win64.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/114.0.5735.26/linux64/chromedriver-linux64.zip 404
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/114.0.5735.26/mac-arm64/chromedriver-mac-arm64.zip 404
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/114.0.5735.26/mac-x64/chromedriver-mac-x64.zip 404
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/114.0.5735.26/win32/chromedriver-win32.zip 404
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/114.0.5735.26/win64/chromedriver-win64.zip 404
✅ OK

Checking the Dev channel…
Found versions: Set(1) { '115.0.5762.4' }
Recommended version for Dev channel: 115.0.5762.4
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/115.0.5762.4/linux64/chrome-linux64.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/115.0.5762.4/mac-arm64/chrome-mac-arm64.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/115.0.5762.4/mac-x64/chrome-mac-x64.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/115.0.5762.4/win32/chrome-win32.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/115.0.5762.4/win64/chrome-win64.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/115.0.5762.4/linux64/chromedriver-linux64.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/115.0.5762.4/mac-arm64/chromedriver-mac-arm64.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/115.0.5762.4/mac-x64/chromedriver-mac-x64.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/115.0.5762.4/win32/chromedriver-win32.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/115.0.5762.4/win64/chromedriver-win64.zip 200
✅ OK

Checking the Canary channel…
Found versions: Set(2) { '115.0.5765.0', '115.0.5763.0' }
Recommended version for Canary channel: 115.0.5763.0
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/115.0.5763.0/linux64/chrome-linux64.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/115.0.5763.0/mac-arm64/chrome-mac-arm64.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/115.0.5763.0/mac-x64/chrome-mac-x64.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/115.0.5763.0/win32/chrome-win32.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/115.0.5763.0/win64/chrome-win64.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/115.0.5763.0/linux64/chromedriver-linux64.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/115.0.5763.0/mac-arm64/chromedriver-mac-arm64.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/115.0.5763.0/mac-x64/chromedriver-mac-x64.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/115.0.5763.0/win32/chromedriver-win32.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/115.0.5763.0/win64/chromedriver-win64.zip 200
✅ OK
```

### Check a specific Chrome version for CfT binary availability

```
$ npm run check 115.0.5763.0

> check
> node --no-warnings check-version.mjs "115.0.5763.0"

Checking downloads for v115.0.5763.0…
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/115.0.5763.0/linux64/chrome-linux64.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/115.0.5763.0/mac-arm64/chrome-mac-arm64.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/115.0.5763.0/mac-x64/chrome-mac-x64.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/115.0.5763.0/win32/chrome-win32.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/115.0.5763.0/win64/chrome-win64.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/115.0.5763.0/linux64/chromedriver-linux64.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/115.0.5763.0/mac-arm64/chromedriver-mac-arm64.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/115.0.5763.0/mac-x64/chromedriver-mac-x64.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/115.0.5763.0/win32/chromedriver-win32.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/115.0.5763.0/win64/chromedriver-win64.zip 200
✅ OK
```
