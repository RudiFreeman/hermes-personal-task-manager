# Version 0.2.6 deployment - 2026-11-18

Fixed the shared Dashboard/WebApp UI:
- Restored the blue Add submit button while preserving quiet inline add links.
- Replaced the oversized text close glyph with centered CSS strokes.
- Added an Add task link and inline creation form below the root task list.
- Prevented a newly created task's details from closing before refresh completed.

Local production build, all Node suites and Chromium geometry/color checks passed.
Dashboard and WebApp adapter tests create a root task from the bottom form;
Dashboard also verifies focus, Escape cancellation and preservation of the draft.

Uploaded directly to the working VPS and synchronized the separate Desktop copy.
The previous 0.2.5 installation and a consistent working DB backup are retained at
`/root/.hermes/backups/ptm-before-0.2.6-20261118T085428Z`.

Installed Plugin Doctor passed for 0.2.6 (three tools, zero hooks). Dashboard
JavaScript and CSS returned HTTP 200 and matched the release files byte for byte;
checks confirmed the new root add link/form and close icon styling. The WebApp
bundle matched its installed source. Dashboard was restarted to refresh discovery;
both services are active and the Gateway PID remained unchanged.

No database migration or task writes were performed during deployment.
Source was deployed directly; GitHub and catalog PR publishing were outside scope.
