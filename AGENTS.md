# Agent Instructions

## Testing & Quality Checks

- Run `bun run check` for project-wide linting via Turbo and Biome.
- Run `bun run check-types` to execute TypeScript project checks.
- Do not mark a task, phase, or proposal complete until all three commands pass without warnings.

<communication style="concise">

1. Be extremely concise. Sacrifice grammar for the sake of concision.
2. Use simple words. Avoid jargon and complex vocabulary.
3. Use short sentences. Keep sentences under 15 words.
4. Use bullet points and lists. Break down complex info into lists.
5. Prioritize clarity. Ensure the meaning is clear, even if brief.
6. Avoid filler words. Remove unnecessary words and phrases.
7. Use active voice. Prefer active constructions over passive ones.
8. Be direct. Get to the point quickly without unnecessary preamble.

</communication>

<bd priority="1">

## Issue Tracking with bd (beads)

**IMPORTANT**: This project uses **bd (beads)** for ALL issue tracking. Do NOT use markdown TODOs, task lists, or other tracking methods.

### Why bd?

- Dependency-aware: Track blockers and relationships between issues
- Git-friendly: Auto-syncs to JSONL for version control
- Agent-optimized: JSON output, ready work detection, discovered-from links
- Prevents duplicate tracking systems and confusion

### Quick Start

**Check for ready work:**

```bash
bd ready --json
```

**Create new issues:**

```bash
bd create "Issue title" -t bug|feature|task -p 0-4 --json
bd create "Issue title" -p 1 --deps discovered-from:bd-123 --json
```

**Claim and update:**

```bash
bd update bd-42 --status in_progress --json
bd update bd-42 --priority 1 --json
```

**Complete work:**

```bash
bd close bd-42 --reason "Completed" --json
```

### Issue Types

- `bug` - Something broken
- `feature` - New functionality
- `task` - Work item (tests, docs, refactoring)
- `epic` - Large feature with subtasks
- `chore` - Maintenance (dependencies, tooling)

### Priorities

- `0` - Critical (security, data loss, broken builds)
- `1` - High (major features, important bugs)
- `2` - Medium (default, nice-to-have)
- `3` - Low (polish, optimization)
- `4` - Backlog (future ideas)

### Workflow for AI Agents

1. **Check ready work**: `bd ready` shows unblocked issues
2. **Claim your task**: `bd update <id> --status in_progress`
3. **Work on it**: Implement, test, document
4. **Discover new work?** Create linked issue:
   - `bd create "Found bug" -p 1 --deps discovered-from:<parent-id>`
5. **Complete**: `bd close <id> --reason "Done"`
6. **Commit together**: Always commit the `.beads/issues.jsonl` file together with the code changes so issue state stays in sync with code state

### Auto-Sync

bd automatically syncs with git:

- Exports to `.beads/issues.jsonl` after changes (5s debounce)
- Imports from JSONL when newer (e.g., after `git pull`)
- No manual export/import needed!

### Important Rules

- Use bd for ALL task tracking
- Always use `--json` flag for programmatic use
- Link discovered work with `discovered-from` dependencies
- Check `bd ready` before asking "what should I work on?"
- Do NOT create markdown TODO lists
- Do NOT use external issue trackers
- Do NOT duplicate tracking systems
- Do NOT clutter repo root with planning documents

Important reminders:
   • Use bd for ALL task tracking - NO markdown TODO lists
   • Always use --json flag for programmatic bd commands
   • Link discovered work with discovered-from dependencies
   • Check bd ready before asking "what should I work on?"

</bd>
