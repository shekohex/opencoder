# opencoder

OpenCoder is an open-source interface (mobile, web, and desktop) for managing remote workspaces on [Coder](https://coder.com) and vibing with [OpenCode](https://opencode.ai).

## Features

- **Cross-Platform** - Shared UI system for iOS, Android, and Web using Expo and React Native Web.
- **Modern Tech Stack** - Built with TypeScript, Bun, and Turborepo.
- **Headless UI** - Accessible primitives powered by React Native ARIA.
- **Native Performance** - Fast storage with MMKV and Nitro Modules.
- **Styling** - Utility-first styling with Uniwind (Tailwind v4 support).
- **Code Quality** - Linting and formatting with Biome, type checking with TypeScript.

## Project Structure

```bash
opencoder/
├── apps/
│   └── native/      # Expo mobile and web application
├── packages/
│   ├── codersdk/    # Optimized TypeScript SDK for Coder API
│   └── config/      # Shared configuration (TSConfig, etc.)
└── .beads/          # Issue tracking (powered by bd)
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (v1.3.1 or later)
- [CocoaPods](https://cocoapods.org/) (for iOS development)
- [Android Studio](https://developer.android.com/studio) (for Android development)

### Installation

```bash
bun install
```

### Development

Run the development server for all platforms:

```bash
bun run dev
```

Target specific platforms:

```bash
# Mobile development (iOS/Android/Web)
bun run dev:native

# Web only
bun run dev:web
```

## Quality Gates

We enforce strict quality gates for all contributions:

```bash
# Run all quality checks
bun run check        # Linting and formatting (Biome)
bun run check-types  # TypeScript checks
bun run test         # Unit and integration tests
```

## Issue Tracking

This project uses [bd (beads)](https://github.com/shekohex/bd) for issue tracking.

```bash
# See unblocked issues
bd ready --json
```

Refer to [AGENTS.md](./AGENTS.md) for more detailed workflow instructions.
