# Catalog submission staging

No catalog pull request has been created. Templates are local preparation
artifacts and deliberately contain placeholders rather than a misleading pin.
`community` is the entry's tier; `tools` is its category. This does not label
the plugin as maintained or verified by NousResearch.

After the candidate source is committed locally, render an exact entry:

```sh
python scripts/prepare_catalog.py --sha FULL_40_CHARACTER_COMMIT
```

The command reads only local Git data, checks the pinned version, compatibility
floor and screenshot assets, then writes under ignored `.local/catalog-submission`:

- `plugin-catalog/personal-task-manager.yaml`: the single upstream entry.
- `PR_BODY.md`: English description with explicit pending acceptance markers.
- `catalog.patch`: a patch adding only that YAML to NousResearch/hermes-agent.

It does not push, fork, contact GitHub, create branches or open a pull request.
Publishing the source commit for Git installer testing requires separate user
confirmation. Before submitting upstream, the owner must install that exact
commit through the normal Git installer and explicitly approve the result.
Then replace the PR's pending validation/acceptance markers with actual evidence,
confirm the SHA is public and images resolve, and rerun current Hermes validation.

In a separate clean checkout of NousResearch/hermes-agent, inspect the patch
with `git apply --check /absolute/path/catalog.patch`, then apply it only when
ready. Do not open the upstream PR before the owner's explicit approval.
