# Interface screenshots

These images show the actual candidate plugin bundle rendered inside the native
Hermes Dashboard and WebApp on v0.23.1. Only the plugin panel is captured.
All task content is synthetic: capture intercepts task GET responses and refuses
task mutations. It also supplies the candidate's JS/CSS in that browser context,
without replacing the installed plugin or restarting a host service.

- dashboard-light.png / dashboard-dark.png: native Dashboard themes.
- webapp-light.png / webapp-dark.png: native WebApp themes.
- webapp-mobile.png: 390 px WebApp viewport.

To reproduce, install Playwright separately and use private, operator-supplied
authenticated state files outside the repository. Select the same disposable
profile in both URLs and enable the Desktop half in that browser first:

```sh
python scripts/capture_screenshots.py \
  --dashboard-url 'http://127.0.0.1:9119/personal-tasks?profile=YOUR_TEST_PROFILE' \
  --webapp-url 'https://YOUR_HOST/Webapp/?profile=YOUR_TEST_PROFILE' \
  --dashboard-state /private/dashboard-state.json \
  --webapp-state /private/webapp-state.json \
  --profile YOUR_TEST_PROFILE
```

An optional --chromium path selects an existing browser installation. Save both
localStorage and sessionStorage if the host requires them; the accepted envelope
is the same as tests/test_browser.py. Never commit those state files or screenshots
of real task data. This capture tool demonstrates layout, not storage or mutation
correctness; those are covered by the separate regression suites.
