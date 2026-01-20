# Opencode SDK/API Research

## Overview
Location: `/home/coder/opencode/packages/sdk/js`

Generated using `@hey-api/openapi-ts` with wrapper client.

## SDK Structure

```
packages/sdk/js/
├── src/
│   ├── gen/ - Auto-generated API types and clients
│   ├── v2/ - SDK client wrapper
│   └── - Server/Client utilities
```

## API Endpoints

| Module | Endpoints |
|--------|-----------|
| **Session** | `/session`, `/session/{id}`, `/session/{id}/message`, `/session/{id}/prompt`, `/session/{id}/status`, `/session/{id}/create`, `/session/{id}/children`, `/session/{id}/fork`, `/session/{id}/abort`, `/session/{id}/share` |
| **Message** | `/session/{id}/message/{messageID}`, streaming, part updates |
| **File** | `/file`, `/file/content`, `/file/status` |
| **Provider** | `/provider`, `/provider/{id}/oauth/authorize`, `/provider/{id}/oauth/callback` |
| **Config** | `/config`, `/config/providers` |
| **Event** | `/global/event` (SSE streaming) |
| **Project** | `/project`, `/project/current` |
| **PTY** | `/pty`, `/pty/{id}`, `/pty/{id}/connect` |
| **Tool** | `/experimental/tool`, `/experimental/tool/ids` |
| **MCP** | `/mcp`, `/mcp/{name}/auth`, `/mcp/{name}/connect` |
| **LSP** | `/lsp` status |
| **TUI** | `/tui/append-prompt`, `/tui/show-toast`, `/tui/execute-command` |
| **Agent** | `/agent`, agent config |
| **Auth** | `/auth/{id}` for credentials |
| **Command** | `/command` |

## Data Models

### Event Types (SSE)
- `EventMessageUpdated`, `EventMessagePartUpdated`, `EventPermissionUpdated`
- `EventSessionCreated`, `EventSessionStatus`, `EventSessionDeleted`
- `EventTuiPromptAppend`, `EventPtyCreated`, `EventFileEdited`

### Message Parts
- Text, File, Tool, Agent, Reasoning, StepStart, StepFinish, Patch, Snapshot

### Session
- Summary stats, file diffs, version tracking, sharing state

## Authentication Types

| Type | Description |
|------|-------------|
| OAuth | Refresh/access tokens, enterprise URL |
| API Key | Simple key-based |
| Well-known | Key-value pairs |

## Client Usage Pattern

```typescript
import { createOpencodeClient } from "@opencode-ai/sdk"

// Create client
const client = createOpencodeClient({ baseUrl: "http://localhost:4096" })

// SSE event subscription
const eventStream = client.event.subscribe()

// Session operations
const session = await client.session.create()
const messages = await client.session.messages({ path: { id: session.id } })
await client.session.prompt({
  path: { id: session.id },
  body: { parts: [...] }
})
```

## Core Capabilities

| Area | Features |
|------|----------|
| **File operations** | Read, list, diff, status |
| **Shell/PTY** | Spawn processes, stream output |
| **Agents** | Multiple agent types (build, plan, explore, general) |
| **Tools** | Edit, grep, glob, lsp, formatter, webfetch, codesearch |
| **MCP** | Server configuration and auth |
| **TUI Control** | Append prompts, show toasts, execute commands |
| **Event Streaming** | Real-time updates via SSE |

## Key Files

- `packages/sdk/js/src/v2/` - SDK client wrapper
- `packages/sdk/js/src/gen/` - Generated types and clients
- `packages/sdk/js/src/` - Server/client utilities
