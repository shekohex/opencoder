# Auth Workflow (Base URL + Password + OAuth Device Flow) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild auth flow with base URL step, password login, and OAuth device flows.

**Architecture:** Use `@coder/sdk` with React Query. Store base URL and session token, drive UI from queries and mutations. Device flow uses start + poll exchange endpoints. Screen design mirrors Coder login UX.

**Tech Stack:** React Native (Expo), TypeScript, @tanstack/react-query, @coder/sdk, expo-clipboard, Linking API

---

## References (Coder workflow)

- ` /tmp/coder/site/src/pages/LoginPage/LoginPage.tsx `
- ` /tmp/coder/site/src/pages/LoginPage/LoginPageView.tsx `
- ` /tmp/coder/site/src/pages/LoginPage/SignInForm.tsx `
- ` /tmp/coder/site/src/pages/LoginPage/PasswordSignInForm.tsx `
- ` /tmp/coder/site/src/pages/LoginPage/OAuthSignInForm.tsx `
- ` /tmp/coder/site/src/pages/LoginPage/TermsOfServiceLink.tsx `
- ` /tmp/coder/site/src/contexts/auth/AuthProvider.tsx `
- ` /tmp/coder/site/src/api/queries/users.ts `

## Task 1: Add SDK support for device start by provider

**Files:**
- Modify: `packages/codersdk/src/api.ts`
- Modify: `packages/codersdk/src/api.test.ts`
- Modify: `packages/codersdk/src/typesGenerated.ts` (only if new types needed)

**Step 1: Write failing test**

Add a test for a new method like `getExternalAuthDevice(provider)`.

```ts
it("gets external auth device by provider", async () => {
  server.use(
    http.get("/api/v2/external-auth/oidc/device", () => {
      return HttpResponse.json({
        device_code: "d",
        user_code: "u",
        verification_uri: "https://example.com",
        expires_in: 600,
        interval: 5,
      });
    }),
  );

  const result = await API.getExternalAuthDevice("oidc");
  expect(result.user_code).toBe("u");
});
```

**Step 2: Run test to verify it fails**

Run: `bun test packages/codersdk/src/api.test.ts`
Expected: FAIL with method missing.

**Step 3: Write minimal implementation**

```ts
getExternalAuthDevice = async (
  provider: string,
): Promise<TypesGen.ExternalAuthDevice> => {
  return this.request<TypesGen.ExternalAuthDevice>(
    "GET",
    `/api/v2/external-auth/${provider}/device`,
  );
};
```

**Step 4: Run test to verify it passes**

Run: `bun test packages/codersdk/src/api.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add packages/codersdk/src/api.ts packages/codersdk/src/api.test.ts
git commit -m "feat: add external auth device endpoint"
```

## Task 2: Add storage and session helpers for base URL + token

**Files:**
- Modify: `apps/native/lib/auth.tsx`
- Modify: `apps/native/lib/storage.ts` (if new keys/helpers needed)

**Step 1: Write failing test**

Create unit tests for storing base URL and token. If no test harness exists, add small hook tests in `apps/native/lib/auth.test.tsx`.

**Step 2: Run test to verify it fails**

Run: `bun test apps/native/lib/auth.test.tsx`
Expected: FAIL until hook supports base URL + token.

**Step 3: Write minimal implementation**

- Add `baseUrl` and `setBaseUrl` to session context.
- Add `sessionToken` and `setSessionToken`.
- On set, call `API.setHost(baseUrl)` and `API.setSessionToken(token)`.

**Step 4: Run test to verify it passes**

Run: `bun test apps/native/lib/auth.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add apps/native/lib/auth.tsx apps/native/lib/auth.test.tsx
git commit -m "feat: persist coder base url and session token"
```

## Task 3: Base URL entry screen

**Files:**
- Modify: `apps/native/app/sign-in.tsx`
- Modify: `apps/native/components/text-field.tsx` (only if needed)
- Create: `apps/native/components/auth/base-url-step.tsx`

**Step 1: Write failing test**

Add a screen test rendering the base URL step and verify validation error for invalid URL.

**Step 2: Run test to verify it fails**

Run: `bun test apps/native/components/auth/base-url-step.test.tsx`
Expected: FAIL.

**Step 3: Write minimal implementation**

- Use `TextField` compound component.
- Validate URL and normalize (trim + add https if missing).
- On submit, store base URL and trigger auth methods query.

**Step 4: Run test to verify it passes**

Run: `bun test apps/native/components/auth/base-url-step.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add apps/native/app/sign-in.tsx apps/native/components/auth/base-url-step.tsx apps/native/components/auth/base-url-step.test.tsx
git commit -m "feat: add coder base url step"
```

## Task 4: Auth methods screen (password + OAuth)

**Files:**
- Create: `apps/native/components/auth/auth-methods-step.tsx`
- Modify: `apps/native/app/sign-in.tsx`
- Modify: `apps/native/components/button.tsx` (only if new icon sizing needed)

**Step 1: Write failing test**

Add a test to render auth methods with GitHub enabled and password enabled.

**Step 2: Run test to verify it fails**

Run: `bun test apps/native/components/auth/auth-methods-step.test.tsx`
Expected: FAIL.

**Step 3: Write minimal implementation**

- Use logo + title and align with Coder login look.
- GitHub button uses `simple-icons` icon.
- Password form uses `TextField` and a submit `Button`.
- Divider “or” between OAuth and password.
- Use `useMutation` for password login and set session token on success.

**Step 4: Run test to verify it passes**

Run: `bun test apps/native/components/auth/auth-methods-step.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add apps/native/components/auth/auth-methods-step.tsx apps/native/components/auth/auth-methods-step.test.tsx apps/native/app/sign-in.tsx
git commit -m "feat: render auth methods and password login"
```

## Task 5: Device flow screen for GitHub and OIDC

**Files:**
- Create: `apps/native/components/auth/device-flow-step.tsx`
- Modify: `apps/native/app/sign-in.tsx`
- Modify: `apps/native/package.json` (add `expo-clipboard`)

**Step 1: Write failing test**

Add a test that renders device flow screen with a user code and ensures copy button calls clipboard API.

**Step 2: Run test to verify it fails**

Run: `bun test apps/native/components/auth/device-flow-step.test.tsx`
Expected: FAIL.

**Step 3: Write minimal implementation**

- Start device flow via `API.getExternalAuthDevice(provider)`.
- Show `user_code`, `verification_uri`.
- Use `expo-clipboard` to copy `user_code`.
- Use `Linking.openURL` for CTA.
- Poll exchange via `API.exchangeExternalAuthDevice(provider, { device_code })`.
- On success, set token and fetch `me`.

**Step 4: Run test to verify it passes**

Run: `bun test apps/native/components/auth/device-flow-step.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add apps/native/components/auth/device-flow-step.tsx apps/native/components/auth/device-flow-step.test.tsx apps/native/app/sign-in.tsx apps/native/package.json
git commit -m "feat: add oauth device flow screen"
```

## Task 6: React Query hooks and query keys

**Files:**
- Create: `apps/native/lib/auth-queries.ts`
- Modify: `apps/native/app/sign-in.tsx`

**Step 1: Write failing test**

Add tests for `useAuthMethods`, `useLogin`, `useDeviceStart`, `useDevicePoll`.

**Step 2: Run test to verify it fails**

Run: `bun test apps/native/lib/auth-queries.test.tsx`
Expected: FAIL.

**Step 3: Write minimal implementation**

- Implement hooks with React Query.
- Ensure query keys include `baseUrl`.
- Provide clear error surfaces for UI.

**Step 4: Run test to verify it passes**

Run: `bun test apps/native/lib/auth-queries.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add apps/native/lib/auth-queries.ts apps/native/lib/auth-queries.test.tsx apps/native/app/sign-in.tsx
git commit -m "feat: add auth react-query hooks"
```

## Task 7: Session-aware routing and cleanup

**Files:**
- Modify: `apps/native/app/(app)/_layout.tsx`
- Modify: `apps/native/lib/auth.tsx`

**Step 1: Write failing test**

Add a test to ensure unauthenticated users redirect to `/sign-in` and authenticated users proceed.

**Step 2: Run test to verify it fails**

Run: `bun test apps/native/app/(app)/_layout.test.tsx`
Expected: FAIL.

**Step 3: Write minimal implementation**

- Use `me` query data to define `session` presence.
- Add `signOut` that clears storage and query cache.

**Step 4: Run test to verify it passes**

Run: `bun test apps/native/app/(app)/_layout.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add apps/native/app/(app)/_layout.tsx apps/native/app/(app)/_layout.test.tsx apps/native/lib/auth.tsx
git commit -m "feat: route based on session"
```

## Task 8: Visual polish to match Coder screens

**Files:**
- Modify: `apps/native/components/auth/*.tsx`
- Modify: `apps/native/themes/*` (only if needed)

**Step 1: Visual tweaks**

- Center layout, spacing, and typography.
- Use simple-icons GitHub logo.
- Mirror device flow layout and copy button.

**Step 2: Manual check**

Run app on web + native. Verify layout matches screenshots.

**Step 3: Commit**

```bash
git add apps/native/components/auth/*.tsx apps/native/themes/*
git commit -m "chore: refine auth screen visuals"
```

## Quality gates

Run:
- `bun run test`
- `bun run check`
- `bun run check-types`

Expected: all pass with no warnings.

---

Plan complete and saved to `docs/plans/2025-12-25-auth-workflow.md`. Two execution options:

1. Subagent-Driven (this session) - I dispatch fresh subagent per task, review between tasks, fast iteration
2. Parallel Session (separate) - Open new session with executing-plans, batch execution with checkpoints

Which approach?
