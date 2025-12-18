---
description: Manage issue templates for streamlined issue creation
---

Manage issue templates for streamlined issue creation.

## Synopsis

Templates provide pre-filled structures for common issue types, making it faster to create well-formed issues with consistent formatting.

```bash
bd template list
bd template show <template-name>
bd template create <template-name>
```

## Description

Templates can be:
- **Built-in**: Provided by bd (epic, bug, feature)
- **Custom**: Stored in `.beads/templates/` directory

Each template defines default values for:
- Description structure with placeholders
- Issue type (bug, feature, task, epic, chore)
- Priority (0-4)
- Labels
- Design notes structure
- Acceptance criteria structure

## Commands

### list

List all available templates (built-in and custom).

```bash
bd template list
bd template list --json
```

### show

Show detailed structure of a specific template.

```bash
bd template show <template-name>
bd template show <template-name> --json
```

### create

Create a custom template in `.beads/templates/` directory.

```bash
bd template create <template-name>
```

This creates a YAML file with default structure that you can edit to customize.

## Using Templates with `bd create`

Use the `--from-template` flag to create issues from templates:

```bash
bd create --from-template <template-name> "Issue title"
```

Template values can be overridden with explicit flags:

```bash
# Use bug template but override priority
bd create --from-template bug "Login crashes on special chars" -p 0

# Use epic template but add extra labels
bd create --from-template epic "Q4 Infrastructure" -l infrastructure,ops
```

## Built-in Templates

### epic
For large features composed of multiple issues.
- Type: epic, Priority: P1, Labels: epic

### bug
For bug reports with consistent structure.
- Type: bug, Priority: P1, Labels: bug

### feature
For feature requests and enhancements.
- Type: feature, Priority: P2, Labels: feature

## Custom Templates

Custom templates override built-in templates with the same name. This allows you to customize built-in templates for your project.

**Priority:**
1. Custom templates in `.beads/templates/`
2. Built-in templates

## Best Practices

1. **Use templates for consistency**: Establish team conventions for common issue types
2. **Customize built-ins**: Override built-in templates to match your workflow
3. **Version control templates**: Commit `.beads/templates/` to share across team
4. **Keep templates focused**: Create specific templates (e.g., `performance`, `security-audit`) rather than generic ones
5. **Use placeholders**: Mark sections requiring input with `[brackets]` or `TODO`
6. **Include checklists**: Use `- [ ]` for actionable items in description and acceptance criteria
