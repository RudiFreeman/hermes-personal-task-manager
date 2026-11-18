# Existing catalog PR: #157264

Update [NousResearch/hermes-agent#157264](https://github.com/NousResearch/hermes-agent/pull/157264),
not a replacement PR. Its current head is the `catalog-personal-task-manager-6029ac4`
branch of `RudiFreeman/hermes-agent`. The earlier entry pins plugin version 0.2.3;
this candidate updates the same entry to **1.0.0**.

`community` is the tier and `tools` is the category. The project is not presented
as maintained or verified by NousResearch.

## Prepare locally

1. Preserve UI edits and run `npm run build` and `npm test`.
2. Run Python tests on temporary databases and current Hermes admission validation:
   `hermes plugins validate /path/to/candidate --install-deps`.
3. Refresh `docs/screenshots` with native host screenshots on synthetic tasks.
4. Commit the complete source, generated bundles, documentation and PNGs locally.
5. Generate the exact entry and PR body from that full, local source commit:

```text
python scripts/prepare_catalog.py --sha FULL_40_CHARACTER_SOURCE_COMMIT \
  --validation-report /private/review/validation-summary.json \
  --previous-entry /private/review/previous-catalog.yaml
```

The script checks all version declarations and committed PNGs. Generated files
are placed in ignored `.local/catalog-submission`: YAML, `PR_BODY.md`, a patch
against upstream main, and an optional patch against the current PR entry.
It performs no network requests and never pushes or modifies GitHub.

## Publish only after the owner's confirmation

After approval, push the source commit first. Then run:

```text
python scripts/verify_catalog_links.py --sha FULL_40_CHARACTER_SOURCE_COMMIT
```

This verifies that the public commit exists and every image URL returns a PNG.
Only then copy the generated YAML to the existing PR branch, commit and push that
branch, and replace the existing PR description with the generated body. Keep
version, full SHA, README URL and all screenshot URLs on that same source commit.
Do not claim the image links were verified while the commit is still local.

Normal-installer owner acceptance is distinct from automated checks; record it
only when actually performed. This preparation does not open a new PR, publish
a commit, change the working VPS installation, or imply catalog acceptance.
