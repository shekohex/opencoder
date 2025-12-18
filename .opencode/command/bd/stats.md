---
description: Show project statistics and progress
---

Display statistics about the current beads project.

!`bd stats --help`

Use the `bd stats` command to retrieve project metrics and present them clearly:

- Total issues by status (open, in_progress, blocked, closed)
- Issues by priority level
- Issues by type (bug, feature, task, epic, chore)
- Completion rate
- Recently updated issues

Optionally suggest actions based on the stats:

- High number of blocked issues? Run `/bd/list --status blocked` to investigate
- No in-progress work? Run `/bd/ready` to find tasks
- Many open issues? Consider prioritizing with `bd update`
