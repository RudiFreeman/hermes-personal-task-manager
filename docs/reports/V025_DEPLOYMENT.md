# Version 0.2.5 deployment - 2026-11-18

Updated the working VPS installation from 0.2.3 to 0.2.5 by uploading the tested
source/build archive over SSH. The package includes a resizable 50/50 task list
and details view, a close button, preserved drafts and full-width mobile details.

Updated locations:
- `/root/.hermes/plugins/personal-task-manager`
- `/root/.hermes/desktop-plugins/personal-task-manager/plugin.js`

Backup: `/root/.hermes/backups/ptm-before-0.2.5-20261118T084525Z` contains the
previous plugin/Desktop code and an SQLite online backup of the working task DB.
Backend files were compared after normalizing line endings and were unchanged;
no database migration was performed.

Validation:
- Local production build and all Node suites passed.
- Local Chromium desktop/mobile layout checks passed.
- Installed Plugin Doctor passed for 0.2.5: three tools, zero hooks.
- Dashboard JS/CSS returned HTTP 200 and matched the installed files byte for byte.
- WebApp copy matched the installed Desktop bundle byte for byte.
- Dashboard was restarted to refresh its plugin discovery cache (PID 97910).
- Gateway remained active with its original PID 62210.

The VPS installation is a direct file deployment over the original 2123c23 Git
checkout; `.ptm-deployment.json` records the deployed version and file hashes.
GitHub main and the catalog PR were not changed by this deployment.
