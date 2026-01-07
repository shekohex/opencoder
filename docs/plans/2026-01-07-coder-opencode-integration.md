# Coder + OpenCode Workspace Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** List Coder workspaces, resolve each workspace OpenCode endpoint, and show OpenCode projects + sessions per workspace.

**Architecture:** Use `@coder/sdk` for workspace metadata and app resolution, then connect to the workspace OpenCode app via the Coder proxy using the same session token. Use a single OpenCode server per workspace (existing port 4096 app) and open multiple sessions per project by using the project worktree directory.

**Tech Stack:** React Native + Expo (apps/native), Bun, TypeScript, `@coder/sdk`, `@opencode-ai/sdk`.

---

## Context, constraints, and confirmed facts

### Confirmed runtime facts (live-tested)
- The workspace `lionzhd` has an OpenCode app defined by Coder with slug `opencode` and subdomain `opencode--lionzhd--shekohex`.
- The OpenCode server is reachable behind the Coder app proxy. Without the token, the proxy responds with `303` redirect. With `Coder-Session-Token`, `/config` returns JSON and `/project` returns project list.
- OpenCode `/project` returns worktrees and IDs. This is what `client.project.list()` uses.

### Coder API entry points (opencoder SDK)
- List workspaces: `API.getWorkspaces` in `packages/codersdk/src/api.ts`.
- Workspace by owner + name: `API.getWorkspaceByOwnerAndName` in `packages/codersdk/src/api.ts`.
- Deployment config (wildcard hostname, path app base): `API.getDeploymentConfig` in `packages/codersdk/src/api.ts`.
- Listening ports (not required for this plan): `API.getAgentListeningPorts` in `packages/codersdk/src/api.ts`.
- Auth header name: `SessionTokenHeader = "Coder-Session-Token"` in `packages/codersdk/src/typesGenerated.ts`.

### Workspace app URL logic reference (Coder)
- Coder UI logic for apps and subdomains: `/tmp/coder/site/src/modules/apps/apps.ts`.
  - Subdomain URL uses `app.subdomain_name` and deployment wildcard host.
  - Path app URL uses `/{owner}/{workspace}.{agent}/apps/{slug}/` on the Coder base domain.

### OpenCode SDK and session API references
- Session API types: `/tmp/opencode/packages/sdk/js/src/gen/types.gen.ts`.
  - `SessionCreateData` supports `query.directory` and body `{ parentID, title }`.
- OpenChamber client usage for sessions and directory scoping:
  - `/tmp/openchamber/packages/ui/src/lib/opencode/client.ts`.
  - `/tmp/openchamber/packages/ui/src/stores/useSessionStore.ts`.

### Current opencoder UI files to update
- Workspace list screen: `apps/native/app/(app)/(drawer)/workspaces/index.tsx`.
- Projects screen: `apps/native/app/(app)/(drawer)/workspaces/projects.tsx`.
- Sessions screen: `apps/native/app/(app)/(drawer)/workspaces/sessions.tsx`.
- Auth state and base URL: `apps/native/lib/auth.tsx`.
- Auth queries: `apps/native/lib/auth-queries.ts`.

### Non-goals for this phase
- No sidecar process or per-project OpenCode servers.
- No PTY orchestration. Use existing OpenCode app on port 4096.
- No workspace creation or mutation.

---

## Data model and state plan

### Workspace list state
Create a small view model that is stable across platforms:
- `WorkspaceSummary`:
  - `id`, `name`, `ownerName`, `status`, `lastUpdatedAt`, `agentName`, `opencodeApp`.
- `WorkspaceGroup`:
  - `ownerName`, `ownerInitials`, `rows: WorkspaceSummary[]`.

### OpenCode endpoint state
Per selected workspace store:
- `opencodeBaseUrl` (external, Coder proxy URL).
- `opencodeAppSlug` = `opencode`.
- `authHeader` = `Coder-Session-Token` from session storage.

### Projects and sessions state
Per workspace + project:
- `ProjectEntry` from OpenCode `client.project.list()`:
  - `id`, `worktree`, `vcs`, `updatedAt`.
- `SessionEntry` from OpenCode `client.session.list({ directory })`:
  - `id`, `title`, `updatedAt`, `status`.

---

## Task 1: Add Coder workspace listing + metadata pipeline

**Files:**
- Modify: `apps/native/lib/auth.tsx`
- Create: `apps/native/lib/workspace-queries.ts`
- Modify: `apps/native/app/(app)/(drawer)/workspaces/index.tsx`
- Test: `apps/native/lib/workspace-queries.test.ts` (create if missing)
- Test: `apps/native/tests/workspace-lists.test.tsx`

**Step 1: Write failing test for workspace query hook**

Create `apps/native/lib/workspace-queries.test.ts` with mocked `API.getWorkspaces`:
```ts
import { API } from "@coder/sdk";
import { fetchWorkspaces } from "./workspace-queries";

test("fetchWorkspaces returns workspaces list", async () => {
  (API.getWorkspaces as jest.Mock).mockResolvedValue({ workspaces: [{ id: "1", name: "demo", owner_name: "me" }] });
  const result = await fetchWorkspaces();
  expect(result.length).toBe(1);
  expect(result[0].name).toBe("demo");
});
```

**Step 2: Run test to verify it fails**
Run: `bun run test apps/native/lib/workspace-queries.test.ts`
Expected: FAIL because `fetchWorkspaces` does not exist.

**Step 3: Implement minimal workspace query module**

Create `apps/native/lib/workspace-queries.ts`:
```ts
import { API } from "@coder/sdk";
import type { TypesGen } from "@coder/sdk";

export async function fetchWorkspaces() {
  const response = await API.getWorkspaces({ q: "owner:me" });
  return response.workspaces ?? [];
}

export function getOwnerInitials(owner: string): string {
  const parts = owner.split(/\s+|\.|_/).filter(Boolean);
  const initials = parts.map((p) => p[0]?.toUpperCase()).filter(Boolean).slice(0, 2);
  return initials.join("") || owner.slice(0, 2).toUpperCase();
}

export function groupWorkspaces(workspaces: TypesGen.Workspace[]) {
  const map = new Map<string, TypesGen.Workspace[]>();
  for (const workspace of workspaces) {
    const owner = workspace.owner_name || "unknown";
    const list = map.get(owner) ?? [];
    list.push(workspace);
    map.set(owner, list);
  }
  return Array.from(map.entries()).map(([owner, rows]) => ({
    owner,
    ownerInitials: getOwnerInitials(owner),
    rows,
  }));
}
```

**Step 4: Run test to verify it passes**
Run: `bun run test apps/native/lib/workspace-queries.test.ts`
Expected: PASS.

**Step 5: Update workspace list screen to use real data**

Update `apps/native/app/(app)/(drawer)/workspaces/index.tsx` to:
- Use a new `useQuery` hook calling `fetchWorkspaces`.
- Replace `workspaceGroups` mock data with `groupWorkspaces` output.
- Set list state based on `query.isLoading`, `query.isError`, and empty results.

**Step 6: Run UI test**
Run: `bun run test apps/native/tests/workspace-lists.test.tsx`
Expected: PASS or update test snapshots to reflect actual data flow.

**Step 7: Commit**
`git add apps/native/lib/workspace-queries.ts apps/native/lib/workspace-queries.test.ts apps/native/app/(app)/(drawer)/workspaces/index.tsx apps/native/tests/workspace-lists.test.tsx`
`git commit -m "feat(workspaces): load workspace list from Coder"`

---

## Task 2: Resolve OpenCode app URL for a workspace

**Files:**
- Create: `apps/native/lib/workspace-apps.ts`
- Modify: `apps/native/lib/auth.tsx`
- Test: `apps/native/lib/workspace-apps.test.ts`

**Step 1: Write failing test for URL resolver**

Create `apps/native/lib/workspace-apps.test.ts`:
```ts
import { resolveOpencodeAppUrl } from "./workspace-apps";

test("resolves subdomain app url", () => {
  const url = resolveOpencodeAppUrl({
    baseUrl: "https://coder.0iq.xyz",
    app: { subdomain: true, subdomain_name: "opencode--lionzhd--shekohex", slug: "opencode" },
    agentName: "main",
    ownerName: "shekohex",
    workspaceName: "lionzhd",
    wildcardHostname: "*.coder.0iq.xyz",
  });
  expect(url).toBe("https://opencode--lionzhd--shekohex.coder.0iq.xyz/");
});
```

**Step 2: Run test to verify it fails**
Run: `bun run test apps/native/lib/workspace-apps.test.ts`
Expected: FAIL because `resolveOpencodeAppUrl` does not exist.

**Step 3: Implement resolver**

Create `apps/native/lib/workspace-apps.ts`:
```ts
export function resolveOpencodeAppUrl(params: {
  baseUrl: string;
  app: { slug: string; subdomain?: boolean; subdomain_name?: string };
  agentName: string;
  ownerName: string;
  workspaceName: string;
  wildcardHostname?: string | null;
  pathAppUrl?: string | null;
}) {
  const { baseUrl, app, agentName, ownerName, workspaceName, wildcardHostname, pathAppUrl } = params;
  if (app.subdomain && app.subdomain_name && wildcardHostname) {
    const host = wildcardHostname.replace("*", app.subdomain_name);
    return `https://${host}/`;
  }
  const base = pathAppUrl || baseUrl;
  return `${base.replace(/\/$/, "")}/@${ownerName}/${workspaceName}.${agentName}/apps/${encodeURIComponent(app.slug)}/`;
}
```

**Step 4: Run test**
Run: `bun run test apps/native/lib/workspace-apps.test.ts`
Expected: PASS.

**Step 5: Add deployment config loader**

In `apps/native/lib/auth.tsx`, store deployment config or expose a helper to load it via `API.getDeploymentConfig`. Cache it in state to avoid repeated requests.

**Step 6: Commit**
`git add apps/native/lib/workspace-apps.ts apps/native/lib/workspace-apps.test.ts apps/native/lib/auth.tsx`
`git commit -m "feat(workspaces): resolve OpenCode app url"`

---

## Task 3: Add OpenCode client wrapper with Coder token header

**Files:**
- Create: `apps/native/lib/opencode-client.ts`
- Modify: `apps/native/lib/auth.tsx`
- Test: `apps/native/lib/opencode-client.test.ts`

**Step 1: Write failing test for auth header**

Create `apps/native/lib/opencode-client.test.ts`:
```ts
import { createOpencodeClient } from "./opencode-client";

test("adds Coder-Session-Token header", async () => {
  const client = createOpencodeClient({ baseUrl: "https://opencode--x.coder.0iq.xyz", sessionToken: "token123" });
  const headers = client.getDefaultHeaders();
  expect(headers["Coder-Session-Token"]).toBe("token123");
});
```

**Step 2: Run test to verify it fails**
Run: `bun run test apps/native/lib/opencode-client.test.ts`
Expected: FAIL because module does not exist.

**Step 3: Implement wrapper**

Create `apps/native/lib/opencode-client.ts` that:
- Creates OpenCode SDK client with baseUrl.
- Attaches `Coder-Session-Token` on every request.
- Exposes `project.list()` and `session.list/create`.

If the SDK does not support default headers, wrap `fetch` and pass through to the SDK.

**Step 4: Run test**
Run: `bun run test apps/native/lib/opencode-client.test.ts`
Expected: PASS.

**Step 5: Commit**
`git add apps/native/lib/opencode-client.ts apps/native/lib/opencode-client.test.ts apps/native/lib/auth.tsx`
`git commit -m "feat(opencode): add client wrapper with Coder auth"`

---

## Task 4: Projects list from OpenCode

**Files:**
- Modify: `apps/native/app/(app)/(drawer)/workspaces/projects.tsx`
- Create: `apps/native/lib/opencode-queries.ts`
- Test: `apps/native/lib/opencode-queries.test.ts`

**Step 1: Write failing test for project listing**

Create `apps/native/lib/opencode-queries.test.ts`:
```ts
import { listProjects } from "./opencode-queries";

test("listProjects returns projects", async () => {
  const client = { project: { list: async () => ({ data: [{ id: "p1", worktree: "/home/coder" }] }) } };
  const projects = await listProjects(client as any);
  expect(projects[0].worktree).toBe("/home/coder");
});
```

**Step 2: Run test**
Run: `bun run test apps/native/lib/opencode-queries.test.ts`
Expected: FAIL because `listProjects` does not exist.

**Step 3: Implement listProjects and hook**

Create `apps/native/lib/opencode-queries.ts`:
```ts
export async function listProjects(client: { project: { list: () => Promise<{ data: any[] }> } }) {
  const res = await client.project.list();
  return Array.isArray(res.data) ? res.data : [];
}
```

**Step 4: Wire into Projects screen**

Update `apps/native/app/(app)/(drawer)/workspaces/projects.tsx` to:
- Get selected workspace from navigation/store.
- Resolve OpenCode base URL (Task 2) and create client (Task 3).
- Load projects with `listProjects`.
- Map projects into sections (by VCS or by directory prefix).

**Step 5: Run tests**
Run: `bun run test apps/native/lib/opencode-queries.test.ts`
Expected: PASS.

**Step 6: Commit**
`git add apps/native/lib/opencode-queries.ts apps/native/lib/opencode-queries.test.ts apps/native/app/(app)/(drawer)/workspaces/projects.tsx`
`git commit -m "feat(opencode): load projects list"`

---

## Task 5: Sessions list + create per project

**Files:**
- Modify: `apps/native/app/(app)/(drawer)/workspaces/sessions.tsx`
- Modify: `apps/native/lib/opencode-queries.ts`
- Test: `apps/native/lib/opencode-queries.test.ts`

**Step 1: Add failing test for sessions list**

Append to `apps/native/lib/opencode-queries.test.ts`:
```ts
import { listSessions, createSession } from "./opencode-queries";

test("listSessions scopes by directory", async () => {
  const client = { session: { list: async (args: any) => ({ data: [{ id: "s1" }], args }) } };
  const sessions = await listSessions(client as any, "/home/coder/project");
  expect(sessions.length).toBe(1);
});

test("createSession passes directory", async () => {
  let seen: any = null;
  const client = { session: { create: async (args: any) => { seen = args; return { data: { id: "s1" } }; } } };
  await createSession(client as any, "/home/coder/project", "New session");
  expect(seen.directory).toBe("/home/coder/project");
});
```

**Step 2: Run tests**
Run: `bun run test apps/native/lib/opencode-queries.test.ts`
Expected: FAIL because functions are missing.

**Step 3: Implement session helpers**

In `apps/native/lib/opencode-queries.ts`:
```ts
export async function listSessions(client: any, directory: string) {
  const res = await client.session.list({ directory });
  return Array.isArray(res.data) ? res.data : [];
}

export async function createSession(client: any, directory: string, title?: string, parentID?: string) {
  const res = await client.session.create({ directory, title, parentID });
  if (!res.data) throw new Error("Failed to create session");
  return res.data;
}
```

**Step 4: Wire into Sessions screen**

Update `apps/native/app/(app)/(drawer)/workspaces/sessions.tsx` to:
- Use selected project worktree path as `directory`.
- Load sessions on mount and on refresh.
- Create new session via `createSession` and push into list.

**Step 5: Run tests**
Run: `bun run test apps/native/lib/opencode-queries.test.ts`
Expected: PASS.

**Step 6: Commit**
`git add apps/native/lib/opencode-queries.ts apps/native/lib/opencode-queries.test.ts apps/native/app/(app)/(drawer)/workspaces/sessions.tsx`
`git commit -m "feat(opencode): list and create sessions"`

---

## Task 6: End-to-end wiring + error handling

**Files:**
- Modify: `apps/native/app/(app)/(drawer)/workspaces/index.tsx`
- Modify: `apps/native/app/(app)/(drawer)/workspaces/projects.tsx`
- Modify: `apps/native/app/(app)/(drawer)/workspaces/sessions.tsx`
- Modify: `apps/native/lib/auth.tsx`

**Step 1: Error states**
- Map Coder errors to a clear "Retry" UI in workspace list.
- Map OpenCode errors to the existing error banner in projects and sessions screens.

**Step 2: Caching and refresh**
- Cache OpenCode base URL per workspace to avoid recomputing every screen load.
- Add pull-to-refresh for sessions and projects if it is already used in similar screens.

**Step 3: Token lifecycle**
- Ensure session token is read once from storage and passed to both Coder SDK and OpenCode client.
- Do not store OpenCode tokens separately; use Coder session token only.

**Step 4: Tests**
- Update or add tests for UI error states if coverage exists.

**Step 5: Commit**
`git add apps/native/app/(app)/(drawer)/workspaces/index.tsx apps/native/app/(app)/(drawer)/workspaces/projects.tsx apps/native/app/(app)/(drawer)/workspaces/sessions.tsx apps/native/lib/auth.tsx`
`git commit -m "feat(workspaces): wire opencode error and refresh states"`

---

## Verification checklist (must pass)
- `bun run test`
- `bun run check`
- `bun run check-types`

---

## References (external code)

- Coder app URL logic: `/tmp/coder/site/src/modules/apps/apps.ts`.
- Coder workspace API usage in UI: `/tmp/coder/site/src/api/api.ts` and `/tmp/coder/site/src/api/queries/workspaces.ts`.
- OpenCode session API types: `/tmp/opencode/packages/sdk/js/src/gen/types.gen.ts`.
- OpenChamber OpenCode client patterns: `/tmp/openchamber/packages/ui/src/lib/opencode/client.ts`.
