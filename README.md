# Chrome for Testing availability

## JSON API endpoints

- [`https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions.json`](https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions.json)
- [`https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions-with-downloads.json`](https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions-with-downloads.json)
- [`https://googlechromelabs.github.io/chrome-for-testing/latest-versions-per-milestone.json`](https://googlechromelabs.github.io/chrome-for-testing/latest-versions-per-milestone.json)
- [`https://googlechromelabs.github.io/chrome-for-testing/latest-versions-per-milestone-with-downloads.json`](https://googlechromelabs.github.io/chrome-for-testing/latest-versions-per-milestone-with-downloads.json)

## CLI utilities

### Find the latest Chrome versions across channels

```
$ npm run find

> find
> node --no-warnings find-version.mjs

Checking the Stable channel…
Found versions: Set(3) { '112.0.5615.165', '112.0.5615.138', '112.0.5615.137' }
Recommended version for Stable channel: 112.0.5615.137
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/112.0.5615.137/linux64/chrome-linux64.zip 404
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/112.0.5615.137/mac-arm64/chrome-mac-arm64.zip 404
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/112.0.5615.137/mac-x64/chrome-mac-x64.zip 404
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/112.0.5615.137/win32/chrome-win32.zip 404
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/112.0.5615.137/win64/chrome-win64.zip 404
❌ NOT OK

Checking the Beta channel…
Found versions: Set(1) { '113.0.5672.53' }
Recommended version for Beta channel: 113.0.5672.53
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/113.0.5672.53/linux64/chrome-linux64.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/113.0.5672.53/mac-arm64/chrome-mac-arm64.zip 404
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/113.0.5672.53/mac-x64/chrome-mac-x64.zip 404
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/113.0.5672.53/win32/chrome-win32.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/113.0.5672.53/win64/chrome-win64.zip 200
❌ NOT OK

Checking the Dev channel…
Found versions: Set(2) { '114.0.5714.0', '114.0.5696.0' }
Recommended version for Dev channel: 114.0.5696.0
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/114.0.5696.0/linux64/chrome-linux64.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/114.0.5696.0/mac-arm64/chrome-mac-arm64.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/114.0.5696.0/mac-x64/chrome-mac-x64.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/114.0.5696.0/win32/chrome-win32.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/114.0.5696.0/win64/chrome-win64.zip 200
✅ OK

Checking the Canary channel…
Found versions: Set(1) { '114.0.5723.0' }
Recommended version for Canary channel: 114.0.5723.0
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/114.0.5723.0/linux64/chrome-linux64.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/114.0.5723.0/mac-arm64/chrome-mac-arm64.zip 404
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/114.0.5723.0/mac-x64/chrome-mac-x64.zip 404
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/114.0.5723.0/win32/chrome-win32.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/114.0.5723.0/win64/chrome-win64.zip 200
❌ NOT OK
```

### Check a specific Chrome version for CfT binary availability

```
$ npm run check 114.0.5721.0

> check
> node --no-warnings check-version.mjs "114.0.5721.0"

Checking downloads for v114.0.5721.0…
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/114.0.5721.0/linux64/chrome-linux64.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/114.0.5721.0/mac-arm64/chrome-mac-arm64.zip 404
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/114.0.5721.0/mac-x64/chrome-mac-x64.zip 404
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/114.0.5721.0/win32/chrome-win32.zip 200
https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/114.0.5721.0/win64/chrome-win64.zip 200
❌ NOT OK
```
