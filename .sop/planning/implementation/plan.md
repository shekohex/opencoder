# Implementation Plan

## Progress Checklist

- [ ] Step 1: Core Data Models & Types
- [ ] Step 2: Chat Message Components (Basic)
- [ ] Step 3: Chat Input & Message Creation
- [ ] Step 4: SSE Event Handling Extension
- [ ] Step 5: Chat Screen Integration
- [ ] Step 6: Message Parts (Diff, Tool, File)
- [ ] Step 7: Permissions & Questions UI
- [ ] Step 8: Git Operations Integration
- [ ] Step 9: Terminal Component (ghostty-web)
- [ ] Step 10: Multi-Agent & Task Tracker
- [ ] Step 11: Settings Screens
- [ ] Step 12: Testing & Polish

## Implementation Steps

### Step 1: Core Data Models & Types

**Objective**: Define TypeScript types for all OpenChamber data structures.

**Implementation**:
- Create `apps/native/types/opencode.ts` with Session, Message, MessagePart, Permission, etc.
- Create `apps/native/types/events.ts` with SSE event types
- Create `apps/native/lib/opencode-queries/chat.ts` with query keys structure
- Export types from central index

**Test**: TypeScript compiles without errors, types can be imported

**Demo**: No UI - type definitions available for import

---

### Step 2: Chat Message Components (Basic)

**Objective**: Build core chat message rendering components.

**Implementation**:
- Create `apps/native/components/chat/MessageHeader.tsx` - Metadata, status indicator
- Create `apps/native/components/chat/MessageBody.tsx` - Content wrapper
- Create `apps/native/components/chat/message/parts/AssistantText.tsx` - Basic text display
- Create `apps/native/components/chat/message/parts/UserText.tsx` - User message display
- Style with Uniwind, match existing app design

**Test**: Components render without props errors

**Demo**: Storybook or test screen showing message components with sample data

---

### Step 3: Chat Input & Message Creation

**Objective**: Build chat input and integrate with OpenCode API for creating messages.

**Implementation**:
- Create `apps/native/components/chat/ChatInput.tsx` - Multiline input, send button
- Create `apps/native/lib/opencode-queries/chat.ts` mutations:
  - `useCreateSession()` - Creates new session
  - `useSendPrompt()` - Sends user message
- Integrate with existing GlobalOpenCodeProvider
- Add toast notifications for errors

**Test**: Can create session and send message, API calls succeed

**Demo**: Chat screen with input, sending prompts creates messages in API

---

### Step 4: SSE Event Handling Extension

**Objective**: Extend GlobalOpenCodeProvider to handle all OpenChamber event types.

**Implementation**:
- Extend `apps/native/lib/opencode-provider.tsx` with new event handlers:
  - `EventMessageUpdated`, `EventMessagePartUpdated`
  - `EventSessionCreated`, `EventSessionStatus`
  - `EventPermissionUpdated`, `EventPtyCreated`
- Create event dispatcher to notify components
- Add reconnection logic with exponential backoff
- Update React Query cache on events

**Test**: Events received from API update query cache

**Demo**: Debug log showing events being received and processed

---

### Step 5: Chat Screen Integration

**Objective**: Build full chat screen connecting all components.

**Implementation**:
- Create `apps/native/components/chat/ChatContainer.tsx` - Main container
- Create `apps/native/components/chat/MessageList.tsx` - Scrollable message list
- Update route `apps/native/app/(app)/(drawer)/workspaces/[workspaceId]/[projectId]/[sessionId]/index.tsx`
- Wire SSE events to update message list in real-time
- Add loading states, empty states
- Handle auto-scroll on new messages

**Test**: Full chat flow works end-to-end

**Demo**: Working chat interface with streaming responses

---

### Step 6: Message Parts (Diff, Tool, File, Reasoning)

**Objective**: Implement specialized message part components.

**Implementation**:
- Create `apps/native/components/chat/message/parts/DiffPreview.tsx` - Syntax-highlighted diff
- Create `apps/native/components/chat/message/parts/ToolUse.tsx` - Tool invocation display
- Create `apps/native/components/chat/message/parts/FilePart.tsx` - File content viewer
- Create `apps/native/components/chat/message/parts/Reasoning.tsx` - Collapsible thinking
- Create `apps/native/lib/diff/` with diff parsing utilities
- Add syntax highlighting (react-syntax-highlighter or similar)

**Test**: Each part renders correctly with sample data

**Demo**: Chat showing all message part types with proper formatting

---

### Step 7: Permissions & Questions UI

**Objective**: Build permission request and question UI.

**Implementation**:
- Create `apps/native/components/permissions/PermissionRequest.tsx` - Main permission UI
- Create `apps/native/components/permissions/PermissionCard.tsx` - Single permission
- Create `apps/native/components/permissions/QuestionCard.tsx` - Agent questions
- Create `apps/native/lib/opencode-queries/permissions.ts` with:
  - `usePermissions()` - Fetch pending permissions
  - `useApprovePermission()` - Approve action
  - `useDenyPermission()` - Deny action
- Wire to SSE `EventPermissionUpdated`

**Test**: Permissions can be approved/denied, agent questions receive responses

**Demo**: Permission modal appears when agent requests access, approval allows continuation

---

### Step 8: Git Operations Integration

**Objective**: Integrate Git operations via remote PTY execution.

**Implementation**:
- Create `apps/native/components/git/GitView.tsx` - Main Git screen
- Create `apps/native/components/git/GitStatus.tsx` - Status display
- Create `apps/native/components/git/GitIdentity.tsx` - Identity management
- Create `apps/native/components/git/CommitEditor.tsx` - AI commit message generation
- Create `apps/native/lib/git-queries.ts` with:
  - `useGitStatus()` - Fetch status via opencode API
  - `useGitCommit()` - Commit via PTY
  - `useGitPush()` - Push via PTY
- Add route for Git screen

**Test**: Can view status, create commits, push changes

**Demo**: Git screen showing working tree changes, creating AI-generated commit

---

### Step 9: Terminal Component (ghostty-web)

**Objective**: Integrate ghostty-web terminal with Expo 'use dom'.

**Implementation**:
- Create `apps/native/components/terminal/Terminal.tsx` with 'use dom' directive
- Import ghostty-web Terminal component
- Create `apps/native/lib/terminal-queries.ts`:
  - `useCreatePty()` - Spawn PTY via opencode API
  - `usePtyEvents()` - Subscribe to PTY SSE events
  - `useWritePty()` - Send input to PTY
- Add route for terminal screen
- Handle terminal sizing, focus

**Test**: Terminal spawns, displays output, accepts input

**Demo**: Functional terminal in app showing command execution

---

### Step 10: Multi-Agent & Task Tracker

**Objective**: Implement multi-agent manager and task tracker UI.

**Implementation**:
- Create `apps/native/components/agent/MultiRunView.tsx` - Multi-agent manager
- Create `apps/native/components/agent/AgentCard.tsx` - Single agent status
- Create `apps/native/components/agent/TaskTracker.tsx` - Task progress
- Create `apps/native/components/agent/TodoList.tsx` - Todo items
- Create `apps/native/lib/agent-queries.ts` with agent management queries
- Add route for multi-agent screen

**Test**: Can launch multiple agents, view their status, track tasks

**Demo**: Multi-agent screen with running agents, live task updates

---

### Step 11: Settings Screens

**Objective**: Build settings screens for configuration.

**Implementation**:
- Create `apps/native/components/settings/SettingsView.tsx` - Main settings
- Create `apps/native/components/settings/ProvidersSection.tsx` - OAuth/API config
- Create `apps/native/components/settings/McpSection.tsx` - MCP servers
- Create `apps/native/components/settings/ModelsSection.tsx` - Model selection
- Create `apps/native/components/settings/SkillsSection.tsx` - Skills catalog
- Create `apps/native/components/settings/AppearanceSection.tsx` - UI scaling
- Create `apps/native/lib/settings-queries.ts` for settings API
- Add route for settings screen

**Test**: Can configure providers, select models, adjust appearance

**Demo**: Settings screen with working configuration options

---

### Step 12: Testing & Polish

**Objective**: Complete test coverage and polish UX.

**Implementation**:
- Write unit tests for all components
- Write unit tests for queries and hooks
- Set up Detox E2E tests for critical flows:
  - Chat flow (create session, send message, receive response)
  - Git flow (view status, commit)
  - Permission flow (approve permission)
- Add loading skeletons
- Improve error handling and recovery
- Add accessibility labels
- Performance optimization (memoization, virtualization)

**Test**: All tests pass, E2E flows work reliably

**Demo**: Full app with all features working, test suite passing
