---
description: Find ready-to-work tasks with no blockers
---

Use the `bd ready` CLI to find tasks that are ready to work on (no blocking dependencies).

!`bd ready --help`

Call the `bd ready` cli to get a list of unblocked issues. Then present them to the user in a clear format showing:
- Issue ID
- Title
- Priority
- Issue type

If there are ready tasks, ask the user which one they'd like to work on. If they choose one, use `bd update` to set its status to `in_progress`.

If there are no ready tasks, suggest checking `blocked` issues or creating a new issue with the `/bd/create` command.
