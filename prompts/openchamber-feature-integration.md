# Implementation: OpenChamber Feature Integration

## Full Path References

**Current Project (Opencoder):**
```
/home/coder/project/opencoder
```

**Source Codebases (Reference Only):**
```
OpenChamber Root:        /home/coder/openchamber
├── packages/ui/src/     - React components, hooks, stores
├── packages/web/src/    - Web entry point
└── packages/desktop/    - Tauri desktop app

Opencode Root:           /home/coder/opencode
├── packages/sdk/js/src/ - OpenCode SDK (generated API client)
│   ├── gen/            - Auto-generated types and clients
│   └── v2/             - SDK client wrapper
└── packages/desktop/    - Tauri wrapper (SDK usage reference)
    ├── src/            - Frontend integration patterns
    └── src-tauri/      - Rust backend, server spawning
```

**Planning Documents:**
```
.sop/planning/
├── rough-idea.md              - Original idea
├── idea-honing.md             - Requirements Q&A
├── research/                  - Research findings
│   ├── openchamber-features.md
│   ├── opencode-desktop-app.md
│   ├── current-app-architecture.md
│   └── opencode-sdk-api.md
├── design/detailed-design.md  - Architecture document
└── implementation/plan.md     - 12-step implementation plan
```

## Objective

Clone ALL OpenChamber features into the Opencoder React Native app. This is a comprehensive integration requiring full feature parity across mobile, web, and desktop platforms.

## Context

**Current State:**
- Opencoder is a React Native (Expo) app with web/desktop support
- Built with Bun, TypeScript, MMKV storage, Nitro Modules
- Current state management: Context API + React Query (NO Redux, NO Zustand)
- Component system: Uniwind (Tailwind v4) utility-first styling
- Routing: Expo Router (file-based) + React Navigation 7
- Existing: Basic workspace integration, OpenCode client, SSE connection pooling

**Source Codebases:**
- OpenChamber: `/home/coder/openchamber` - Full-featured OpenCode UI
- Opencode Desktop: `/home/coder/opencode/packages/desktop` - Tauri wrapper, SDK usage reference
- Opencode SDK: `/home/coder/opencode/packages/sdk/js` - Generated API client

**Design Docs:**
- Read `.sop/planning/design/detailed-design.md` for architecture
- Read `.sop/planning/implementation/plan.md` for 12-step implementation plan

## Requirements

### 1. Feature Scope (ALL features required)

**Chat System:**
- Streaming responses with real-time updates
- Message parts: Text, Diff, Tool, File, Patch, Snapshot, Reasoning, StepStart, StepFinish
- Branchable conversations (fork from any response)
- Diff preview with syntax highlighting
- Streaming text diff
- Message header with metadata (status, timing, tokens)
- Auto-scroll on new messages
- Draft preservation

**Git Operations:**
- Status display (working tree changes)
- Identity management
- AI commit message generation
- Commit, push, pull operations
- Branch creation
- **IMPORTANT:** Git runs REMOTELY on opencode server via PTY, NOT client-side

**Terminal:**
- ghostty-web terminal emulator
- PTY spawning and connection
- Input/output streaming
- Multiple terminal support
- **Use Expo 'use dom' directive** in separate file

**Permissions & Questions:**
- Rich UI for agent/tool permission requests
- Batch approval/denial
- Agent question/ask cards
- Permission history

**Multi-Agent:**
- Multi-agent runs with isolated worktrees
- Agent manager UI
- Agent grouping
- Task tracker with live progress
- Todo list integration

**Settings:**
- Provider management (OAuth, API key, Well-known)
- MCP server configuration
- Model selection with favorites/recents
- Skills catalog
- UI scaling (font size, spacing)
- Session retention policies

**Real-time Events:**
- SSE for all events (messages, sessions, permissions, PTY, files)
- Reconnection with exponential backoff
- Cache updates via React Query

### 2. Technical Constraints (MANDATORY)

**State Management:**
- **ONLY** Context API + React Query
- **NO** Zustand, **NO** Redux
- Use existing GlobalOpenCodeProvider pattern
- Extend for new event types

**Components:**
- **ONLY** use existing Uniwind components (apps/native/components/)
- **DO NOT** import @opencode-ai/ui package
- Rebuild openchamber components with Uniwind styling
- Match existing app design system

**Terminal:**
- Use ghostty-web
- **MUST** use 'use dom' directive at top of file
- Keep in separate file (apps/native/components/terminal/Terminal.tsx)
- Reference: https://docs.expo.dev/guides/dom-components/

**Platform Parity:**
- ALL features work on mobile, web, desktop
- Responsive design with breakpoints
- Platform-specific optimizations allowed

**Implementation:**
- Incremental replacement of existing code
- Each step must result in WORKING, DEMOABLE functionality
- No hanging/orphaned code

**Testing:**
- Unit tests for components, hooks, utilities
- E2E tests with Detox for critical flows
- Run `bun run test`, `bun run check`, `bun run check-types` - all must pass

### 3. Architecture Patterns

**Query Keys:**
```typescript
const chatKeys = {
  sessions: (workspaceId: string) => ['sessions', workspaceId] as const,
  session: (id: string) => ['session', id] as const,
  messages: (sessionId: string) => ['messages', sessionId] as const,
}
```

**Mutations with Toast:**
```typescript
const useSendMessage = () => {
  return useMutation({
    mutationFn: sendMessage,
    onError: (error) => {
      toast.show('Failed to send message', { type: 'error' })
    }
  })
}
```

**SSE Event Handling:**
```typescript
// Extend GlobalOpenCodeProvider
type ChatEventHandler = {
  onMessageUpdated: (event: EventMessageUpdated) => void
  onMessagePartUpdated: (event: EventMessagePartUpdated) => void
  onSessionCreated: (event: EventSessionCreated) => void
  // ... all event types
}
```

**Component File Structure:**
```
apps/native/components/
├── chat/
│   ├── ChatContainer.tsx
│   ├── MessageList.tsx
│   ├── ChatInput.tsx
│   ├── message/
│   │   ├── ChatMessage.tsx
│   │   ├── MessageHeader.tsx
│   │   ├── MessageBody.tsx
│   │   └── parts/
│   │       ├── AssistantText.tsx
│   │       ├── UserText.tsx
│   │       ├── DiffPreview.tsx
│   │       ├── ToolUse.tsx
│   │       ├── FilePart.tsx
│   │       └── Reasoning.tsx
│   └── PermissionRequest.tsx
├── git/
│   ├── GitView.tsx
│   ├── GitStatus.tsx
│   ├── GitIdentity.tsx
│   └── CommitEditor.tsx
├── terminal/
│   └── Terminal.tsx  // 'use dom' at top
├── permissions/
│   ├── PermissionRequest.tsx
│   ├── PermissionCard.tsx
│   └── QuestionCard.tsx
├── agent/
│   ├── MultiRunView.tsx
│   ├── AgentCard.tsx
│   ├── TaskTracker.tsx
│   └── TodoList.tsx
└── settings/
    ├── SettingsView.tsx
    ├── ProvidersSection.tsx
    ├── McpSection.tsx
    ├── ModelsSection.tsx
    ├── SkillsSection.tsx
    └── AppearanceSection.tsx
```

### 4. OpenCode SDK Usage

```typescript
import { createOpencodeClient } from "@opencode-ai/sdk"

// Client creation (use existing createCoderOpenCodeClient wrapper)
const client = createOpencodeClient({ baseUrl: workspaceUrl })

// SSE subscription
const eventStream = client.event.subscribe()

// Session operations
const session = await client.session.create()
await client.session.prompt({
  path: { id: session.id },
  body: { parts: [{ type: 'text', text: 'hello' }] }
})

// Git (via PTY on remote server)
await client.pty.create({ body: { command: ['git', 'status'] } })

// File operations
const files = await client.file.list()
```

## Implementation Plan

Follow the 12 steps in `.sop/planning/implementation/plan.md` EXACTLY:

1. **Core Data Models & Types** - TypeScript types for all data structures
2. **Chat Message Components (Basic)** - MessageHeader, MessageBody, text parts
3. **Chat Input & Message Creation** - ChatInput, create/send mutations
4. **SSE Event Handling Extension** - Extend GlobalOpenCodeProvider for all events
5. **Chat Screen Integration** - Full chat screen with real-time updates
6. **Message Parts (Diff, Tool, File, Reasoning)** - Specialized part components
7. **Permissions & Questions UI** - Permission request and question cards
8. **Git Operations Integration** - Git screen with remote PTY execution
9. **Terminal Component (ghostty-web)** - Terminal with 'use dom'
10. **Multi-Agent & Task Tracker** - Multi-agent manager and task UI
11. **Settings Screens** - All settings sections
12. **Testing & Polish** - Unit tests, Detox E2E, polish

**CRITICAL:**
- Complete steps IN ORDER
- Each step MUST result in WORKING functionality
- DO NOT skip steps
- Run tests after each step
- Commit after each step with conventional commit message

## Quality Gates

Before marking ANY step complete:
1. `bun run check` must pass (linting)
2. `bun run check-types` must pass (TypeScript)
3. `bun run test` must pass (unit tests)
4. Feature must work on web, mobile.

## Key Files to Reference

**Current Integration:**
- `apps/native/lib/opencode-provider.tsx` - SSE connection pooling
- `apps/native/lib/opencode-client.ts` - API client wrapper
- `apps/native/lib/workspace-queries.ts` - Workspace queries pattern

**OpenChamber Reference (DO NOT COPY):**
- `/home/coder/openchamber/packages/ui/src/components/` - Component structure
- `/home/coder/openchamber/packages/ui/src/hooks/useEventStream.ts` - SSE pattern
- `/home/coder/openchamber/packages/ui/src/stores/` - State patterns (convert to React Query)

**Opencode SDK:**
- `/home/coder/opencode/packages/sdk/js/src/gen/` - Generated types
- `/home/coder/opencode/packages/sdk/js/src/v2/` - Client wrapper

## Acceptance Criteria

Feature is complete when:
- [ ] All OpenChamber features implemented
- [ ] Works on mobile, web, desktop
- [ ] Context API + React Query (no Zustand)
- [ ] Uniwind components (no @opencode-ai/ui)
- [ ] Terminal with 'use dom'
- [ ] All tests pass
- [ ] E2E tests cover critical flows
- [ ] ALL Features works as expected on the web browser (use dev-browser skill)
- [ ] SSE handles all event types with reconnection

## Start Here

1. Read `.sop/planning/design/detailed-design.md`
2. Read `.sop/planning/implementation/plan.md`
3. Start with Step 1: Core Data Models & Types
4. Create `apps/native/types/opencode.ts` with all Session, Message, Permission types
5. When complete, run `bun run check && bun run check-types && bun run test`
6. Move to Step 2

**Remember:** Incremental progress, working code at each step, test continuously.
