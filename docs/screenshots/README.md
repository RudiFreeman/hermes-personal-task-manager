# Interface screenshots - version 1.0.0

These are native Hermes Dashboard and WebApp screenshots of the current plugin
bundle, captured with Playwright on separate loopback-only test hosts. The hosts
use Hermes 0.23.1 (`3b421578588243f920886e6fe79a6faa87ea026e`), real host React/SDK
components, assets and themes. They are not standalone preview/mockup images.

Desktop images demonstrate the saved 30% details-panel width setting.
Every task, description, note and result is synthetic. The capture script
intercepts all task API GET responses and refuses task mutations. Only the plugin
panel is included: no account names, email addresses, tokens, hosts, real task
contents or other personal information. Temporary test authentication remains on
the capture host and is never committed or exported with the images.

| File | Content |
| --- | --- |
| dashboard-light.png | English, light theme, resizable list and details |
| dashboard-dark.png | English, dark theme, the same candidate bundle |
| dashboard-mobile.png | English, 390 px viewport, full-width list after closing details |
| dashboard-ru.png | Russian, desktop dark theme |
| webapp-light.png | English, light theme, native WebApp controls |
| webapp-dark.png | English, dark theme |
| webapp-mobile.png | English, 390 px viewport, full-width task details and close button |
| webapp-ru.png | Russian, desktop dark theme |

`capture.json` records bundle/PNG SHA256 digests and viewport dimensions. Bundle
hashes normalize CRLF to LF so Git checkouts on Windows and Linux compare
consistently; original served-byte hashes are retained separately. Its
`privacy_reviewed` flag is set only after visually inspecting all eight PNGs. The
catalog generator checks these hashes in the committed source, preventing an old
image set or a different frontend build from being pinned accidentally.

## Reproduce

Install Playwright in an isolated development environment. Use disposable native
hosts/profiles and private authentication-state files outside this repository:

```text
python scripts/capture_screenshots.py \
  --dashboard-url 'http://127.0.0.1:9119/personal-tasks?profile=YOUR_TEST_PROFILE' \
  --webapp-url 'https://YOUR_HOST/Webapp/?profile=YOUR_TEST_PROFILE' \
  --dashboard-state /private/dashboard-state.json \
  --webapp-state /private/webapp-state.json \
  --profile YOUR_TEST_PROFILE
```

The state envelope supports both `storage` and `session`, as in
`tests/test_browser.py`. Enable the Desktop half in that test browser first. The
optional `--chromium` selects an existing compatible browser. Capture verifies
that candidate Dashboard JS/CSS or the candidate Desktop bundle was actually
loaded. It selects English/Russian through the app's settings and uses native
host theme controls. It makes no changes to the working plugin installation.

Do not replace these with images of real tasks, export authentication states, or
mark privacy review complete without checking the generated pictures. Public
immutable image URLs can be verified only after the owner approves the source
push; use `scripts/verify_catalog_links.py` for that final check.
