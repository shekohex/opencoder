# Idea Honing - Requirements Clarification

*Questions and answers will be documented here as we refine the requirements.*

## Q1: Feature Priority

**Question:** openchamber has many features (chat, git, terminal, permissions, multi-agent, task tracker, settings, etc.). Which features are the highest priority to clone first?

**Answer:** Everything - clone all features: chat, git, terminal, permissions, multi-agent, task tracker, settings, etc.

## Q2: State Management Approach

**Question:** openchamber uses Zustand (24 stores), while current app uses Context API + React Query. Which state management approach should we use?

**Answer:** Context + React Query - Keep existing pattern in app, don't introduce Zustand

## Q3: Component Reusability

**Question:** openchamber has `@opencode-ai/ui` package with Radix UI components. Should we reuse those components or rebuild using the existing app's component system?

**Answer:** Rebuild with app components - Use existing Uniwind + custom components, not @opencode-ai/ui

## Q4: Terminal Integration

**Question:** openchamber uses ghostty-web (web terminal). React Native needs a different approach. How should we handle terminal integration?

**Answer:** Use ghostty-web with Expo's 'use dom' directive (https://docs.expo.dev/guides/dom-components/). Keep terminal component in separate file with 'use dom'.

## Q5: Implementation Approach

**Question:** Should we implement incrementally (feature by feature, replacing existing) or build in parallel and switch over?

**Answer:** Incremental replacement - Add features one by one, replacing existing code as we go

## Q6: Mobile vs Desktop Feature Parity

**Question:** Should all features work on mobile, web, and desktop? Or are some features desktop-only?

**Answer:** Full parity - All features work on all platforms (mobile, web, desktop)

## Q7: Real-time Features (SSE/Streaming)

**Question:** openchamber uses SSE for real-time updates (message streaming, events, status). Current app has basic SSE. How should we handle streaming?

**Answer:** Extend existing SSE - Enhance GlobalOpenCodeProvider to handle all event types from openchamber

## Q8: Testing Strategy

**Question:** How should we test the cloned features? Unit tests, E2E, manual testing?

**Answer:** Unit tests + E2E tests - Test components, hooks, utilities; E2E for critical user flows

**Additional notes:**
- Use Detox for E2E testing
- Git runs remotely on opencode server, not client-side
- PTY already available in opencode - can execute commands (git, etc.) remotely
