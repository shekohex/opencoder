# Session Context: oc-83n - Restructure Desktop Layout for Unified URL Path Params

## Task Summary

Unify desktop and mobile navigation to both use URL path params (`/workspaces/[workspaceId]/[projectId]/[sessionId]`) instead of the current hybrid approach where desktop uses query params.

## Critical Lesson from Previous Attempt

**DO NOT** simply replace setter calls with `router.replace()` in existing components. This was tried and broke the desktop experience because:

1. `DesktopShell` is a component rendered inside route files (e.g., `workspaces/index.tsx`)
2. When `router.replace()` navigates to a new path (e.g., `/workspaces/ws-1`), it mounts a different route
3. This unmounts and remounts `DesktopShell`, causing the sidebars to lose state and flicker

## Correct Approach

Move `DesktopShell` to the **layout level** so it persists across route changes:

```
workspaces/
├── _layout.tsx          # <-- DesktopShell wraps children HERE (desktop only)
├── index.tsx            # Workspace list content
├── [workspaceId]/
│   ├── index.tsx        # Projects list content
│   └── [projectId]/
│       ├── index.tsx    # Sessions list content
│       └── [sessionId]/
│           └── index.tsx # Chat content
```

### Implementation Steps

1. **Create/modify `workspaces/_layout.tsx`**:
   - Check breakpoint (desktop vs mobile)
   - Desktop: Wrap `{children}` with `<DesktopShell>`
   - Mobile: Just render `{children}` (Stack navigator handles it)

2. **Update `DesktopShell`**:
   - Read selection state from `useGlobalSearchParams()` (path params)
   - Use `router.replace(buildWorkspacePath(...))` for navigation
   - Remove dependency on query param setters

3. **Simplify `workspace-nav.tsx`**:
   - Make it read-only (just reads from URL)
   - Remove setter functions
   - Keep `buildWorkspacePath()` utility

4. **Update route files**:
   - They now just render the main content area
   - Desktop: Content appears in the main panel (sidebars come from layout)
   - Mobile: Content is the full screen

## Key Files

- `app/(app)/(drawer)/workspaces/_layout.tsx` - Add DesktopShell wrapper
- `components/sidebar/desktop-shell.tsx` - Update to use path params
- `lib/workspace-nav.tsx` - Simplify to read-only
- `lib/workspace-query-params.ts` - Remove ws/proj/sess params, keep wt only

## Current Architecture (Before)

```
Desktop: workspaces/index.tsx renders DesktopShell with sidebars
         Sidebars update via query params (?ws=xxx&proj=xxx)
         Stays on same route, no navigation

Mobile:  Navigates between nested routes
         /workspaces -> /workspaces/[id] -> /workspaces/[id]/[proj]
         Uses Link components and stack navigation
```

## Target Architecture (After)

```
Desktop: workspaces/_layout.tsx renders DesktopShell (persists!)
         Children are the route content (index, [workspaceId], etc.)
         Sidebars read from URL path params
         router.replace() changes route but layout persists

Mobile:  Same as before - native stack navigation
         Both platforms use same URL structure
```

## Testing Checklist

- [ ] Desktop sidebars persist when clicking items (no flicker/remount)
- [ ] URL updates when selecting workspace/project/session on desktop
- [ ] Direct URL navigation works (paste URL, refresh page)
- [ ] Mobile navigation still works with Link components
- [ ] Back button works correctly on both platforms
- [ ] Worktree query param still works for file paths

## Commands

```bash
bun run check-types  # Type check
bun run check        # Lint
# Run individual test files (full suite has OOM issue - see oc-i37)
cd apps/native && jest --forceExit lib/workspace-nav.test.tsx
```
