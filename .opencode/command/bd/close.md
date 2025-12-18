---
description: Close a completed issue
---

Close a beads issue that's been completed.

If arguments are provided:

- $1: Issue ID
- $2+: Completion reason (optional)

If the issue ID is missing, ask for it. Optionally ask for a reason describing what was done.

Use the `bd close` command to close the issue. Show confirmation with the issue details.

!`bd close --help`

After closing, suggest checking for:

- Dependent issues that might now be unblocked (use `/bd/ready` command)
- New work discovered during this task (use `/bd/create` command with `discovered-from` link)
