# Owner acceptance through the normal Git installer

This is a manual acceptance checklist, not a record of completed owner testing.
Do not submit the catalog PR until the owner explicitly approves the result.

## Before installation

1. Approve publishing only the prepared plugin source to its GitHub repository
   for testing. This does not approve an upstream catalog PR.
2. Record the published full commit SHA and expected version **0.2.1**.
3. Use a disposable Hermes profile first. Keep both host surfaces on that same
   profile. If testing an existing database later, stop all its writers and back
   it up with any WAL files first; schema downgrade is unsupported.

## Install

In Hermes plugin management, choose the Git repository installation option and
enter `https://github.com/RudiFreeman/hermes-personal-task-manager`. If the UI
supports a ref, use the published full SHA. Otherwise verify the repository's
default branch still points at that commit before installing.

Enable the backend in the intended profile. Enable the Desktop half in WebApp
Capabilities / Plugins and open My Tasks. Verify version 0.2.1 and run
`hermes plugins doctor personal-task-manager` if CLI access is available.
Prebuilt host bundles do not require Node development dependencies.

## Verify with synthetic tasks

- Create a task and two subtasks in Dashboard. Collapse/expand by the parent
  title and confirm progress and round checkboxes.
- Open WebApp with the same profile. Confirm the group appears; edit a child
  there and confirm Dashboard receives the change.
- Keep a dirty description open in one surface; change the same task in the
  other. Confirm the draft survives and a stale save is rejected with reload.
- Toggle a child completed and back. Complete the parent: all active children
  complete and the group moves to Archive. Reopen the parent: child checkmarks
  stay. Reopen a child only after its parent.
- Move the group to Trash after confirmation. Restore it in the other surface.
  Cancel permanent deletion once; verify it remains. Confirm deletion only for
  this synthetic group when ready.
- Change English/Russian, reload and check persistence. Check a narrow viewport
  and both host themes for overflow, readable text and usable controls.
- Start a new chat. Explicitly ask Hermes to add a new synthetic task, then
  supply a confirmed result and ask it to mark completion with a comment.
  Verify the UI receives the result. Creating a task must not execute it.

Record the Hermes version, plugin SHA, both surfaces tested, any issues and the
owner's explicit acceptance. Then prepare the final catalog entry and upstream
PR from that exact public commit. Do not silently change the pin after approval.
