# OpenChamber Features Research

## Overview
OpenChamber is a web/desktop/VS Code UI runtime for the OpenCode AI coding agent.

## Core Features

### Chat System
- Chat interface with streaming responses
- Branchable conversations (start new sessions from any response)
- Message parts: Reasoning, Tool, AssistantText, UserText, Justification, File, Patch, Snapshot
- Diff preview with syntax highlighting
- Streaming text diff

### Git Operations
- Git operations with identity management
- AI commit generation
- Status tracking via useGitStore

### Terminal
- Integrated terminal using ghostty-web
- PTY process spawning
- Output streaming

### Permissions & Questions
- Rich UI for agent/tool permission requests
- Question cards for agent interactions
- Permission tracking store

### Multi-Agent
- Multi-agent runs with isolated worktrees
- Agent manager UI
- Agent grouping and favorites
- Model selection with density controls

### Task Management
- Task tracker UI with live progress
- Todo list tracking

### Configuration
- Settings UI
- Provider management (OAuth, API key, Well-known)
- MCP server management
- Skills catalog
- UI scaling (font size, spacing)
- Session auto-cleanup with retention policies
- Memory optimizations (LRU eviction)

## Platform-Specific Features

### Web/PWA
- Mobile-first with gestures
- Optimized terminal controls
- Self-serve web updates
- Cloudflare Quick Tunnel support
- QR code generation for mobile access

### Desktop (macOS)
- Native menu bar integration
- First-launch directory picker
- Server control via Tauri

### VS Code Extension
- Editor-integrated file picker
- Click-to-open from tool output
- In-extension settings access

## UI Components Structure

```
packages/ui/src/
├── components/
│   ├── chat/ (22 components)
│   ├── layout/ (4 components)
│   ├── session/
│   ├── sections/ (shared + agent-identities + openchamber + skills + commands + providers)
│   ├── multirun/ (4 components)
│   ├── mcp/
│   ├── terminal/
│   ├── ui/ (custom primitives)
│   └── views/ (ChatView, GitView, DiffView, TerminalView, SettingsView, AgentManagerView)
├── hooks/ (20 hooks)
├── stores/ (24 Zustand stores)
└── lib/ (API clients, git, terminal, theme, messages)
```

## Key Components

### Chat Components
- ChatContainer, MessageList, ChatInput, ChatMessage
- MessageHeader, MessageBody, MessageParts
- DiffPreview, StreamingTextDiff
- PermissionRequest, PermissionCard
- QuestionCard

### Layout Components
- Sidebar, Header, MainLayout, VSCodeLayout

### Views
- ChatView - Main chat interface
- GitView - Git operations panel
- DiffView - Diff visualization
- TerminalView - Terminal emulator
- SettingsView - Configuration UI
- AgentManagerView - Multi-agent management

## State Management

**Zustand-based** (24 stores):
- useSessionStore - Central hub (~50KB, 13663 LOC)
- useConfigStore - Application configuration
- useUIStore - UI state (tabs, modals, mobile states)
- useAgentsStore - Agent management
- useGitStore - Git operations state
- useGitIdentitiesStore - Git identity management
- useSkillsStore / useSkillsCatalogStore - Skill management
- useMcpStore - MCP server management
- usePermissionStore - Permission tracking
- useQuestionStore - Question/Ask tracking
- useTodoStore - Todo list tracking
- useTerminalStore - Terminal state

## Key Files

### Core
- App.tsx - Main entry
- MainLayout.tsx - Layout orchestration
- ChatContainer.tsx - Chat rendering

### State
- useSessionStore.ts - Main session store
- stores/types/sessionTypes.ts - Type definitions

### OpenCode Integration
- lib/opencode/client.ts - OpenCode SDK client wrapper
- hooks/useEventStream.ts - SSE event handling

### Git
- lib/gitApi.ts - Git operations
- lib/gitApiHttp.ts - Git HTTP client

### Terminal
- lib/terminalApi.ts - Terminal API

### Diff/Preview
- lib/diff/ - Diff worker and utilities
- DiffPreview.tsx, StreamingTextDiff.tsx
