# Version 1.0.0 release preparation

Validated on 2026-11-18. Source push and updating existing catalog PR [#157264](https://github.com/NousResearch/hermes-agent/pull/157264) require owner confirmation.

## Build and automated checks

- `npm run build`: Dashboard, WebApp and development preview built successfully.
- `npm test`: localization, controllers, Dashboard and WebApp suites passed.
- Python: **41 passed**, using temporary databases (`pytest --basetemp=.local/catalog-v100-python-tests-final`). One dependency deprecation warning from Starlette/httpx; no test failures.
- Chromium layout checks: **28 passed** (seven locales × two adapters × actual 1200/360 px viewports). Includes automatic Hermes language inheritance, manual override/reset, persistence, English fallback, localized required fields and dates, close-button position and horizontal overflow.
- All version declarations agree on **1.0.0**: plugin manifest, Dashboard manifest, package metadata, lockfile and README.

## Native host review

Eight fresh [screenshots](../screenshots/README.md) were captured from separate native Hermes Dashboard and WebApp test hosts using synthetic English/Russian tasks. Light/dark themes and a 390 px mobile viewport were reviewed. No production task data was read or changed; task mutation requests were blocked. All eight images were visually checked for private data and unrelated host overlays.

Primary controls inherit the host theme accent, including Hermes Teal. Plugin controls use a common 6 px corner radius; secondary controls and the details close button no longer inherit inconsistent WebApp fills. Native computed-style checks pass for both light/dark themes in both surfaces. Disabled actions remain visibly muted.

`docs/screenshots/capture.json` records image hashes, LF-normalized served bundle hashes, capture time, theme checks and privacy review. The screenshots and code must be published in one immutable source commit.

## Hermes validation and integration limits

The isolated candidate passed `hermes plugins validate <candidate> --install-deps --json` on Hermes **0.23.1** (source `3b421578588243f920886e6fe79a6faa87ea026e`): all **16 checks passed**, no validator warnings, security scan safe. Dependencies were installed only into a temporary test profile. Working VPS services were not replaced or restarted.

Automatic language selection uses the existing optional `useI18n().locale` provided by the Dashboard/Desktop SDK. The locale is followed reactively unless the user selects a manual override. Hosts without that SDK value use the browser/system locale, then English. No Hermes API was invented. Physical-device testing remains separate from Chromium mobile viewport emulation.

## Publication status

The release is prepared locally. Generated YAML and the proposed PR description live under ignored `.local/catalog-submission/` and pin the complete source commit containing code and images. After owner-approved publication, run `scripts/verify_catalog_links.py --sha <full-sha>` to check the public source commit and immutable image URLs. Public URL availability and normal-installer acceptance of that published commit must not be claimed before those steps are performed.
