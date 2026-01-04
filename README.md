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

## Table of Contents

- [Getting Started](#getting-started)
- [Android Build and Release](#android-build-and-release)
- [Quality Gates](#quality-gates)
- [Issue Tracking](#issue-tracking)

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

## Android Build and Release

### Update Version

When using CNG (prebuild), update the app version in `apps/native/app.config.ts` and re-run prebuild so native files stay in sync.

- `version` (user-facing version)
- `android.versionCode` (increment every release)

```bash
bunx expo prebuild --clean
```

### Build (Local AAB with EAS)

`apps/native/eas.json` already sets `JAVA_HOME` and `ANDROID_HOME` for local builds.

```bash
bunx -p eas-cli eas build -p android --profile production --local
```

The AAB will be written to `apps/native/build-<timestamp>.aab`.

### Publish (Fastlane)

Fastlane expects a service account JSON with Play Console access and an existing app in Play Console.

Args or env are both supported:

```bash
# Args
bundle exec --gemfile "apps/native/Gemfile" fastlane upload_play_store \
  aab:/Users/shady/github/shekohex/opencoder/apps/native/build-1767522043689.aab \
  json_key:/Users/shady/github/shekohex/opencoder/apps/native/opencoder-001-ee6878fa8e16.json \
  package_name:com.github.shekohex.opencoder
```

```bash
# Env
AAB_PATH="/Users/shady/github/shekohex/opencoder/apps/native/build-1767522043689.aab" \
PLAY_SERVICE_ACCOUNT_JSON="/Users/shady/github/shekohex/opencoder/apps/native/opencoder-001-ee6878fa8e16.json" \
PACKAGE_NAME="com.github.shekohex.opencoder" \
bundle exec --gemfile "apps/native/Gemfile" fastlane upload_play_store
```

### Troubleshooting

- `Package not found`: The app must exist in Play Console and the service account must have access.
- `SDK location not found`: Ensure `ANDROID_HOME=/Users/shady/Library/Android/sdk` or set `sdk.dir` in `android/local.properties`.
- `Unsupported class file major version 69`: Use JDK 17 (already set in `apps/native/eas.json`).
- `PluginError: Failed to resolve plugin`: Run `bun run build -C packages/expo-plugins` and use the `../../packages/expo-plugins/dist` path in `apps/native/app.config.ts`.

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
