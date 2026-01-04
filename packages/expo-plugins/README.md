# @opencoder/expo-plugins

Reusable Expo config plugins for the OpenCoder workspace.

## Installation

```bash
bun add -d @opencoder/expo-plugins
```

## Usage

Add the plugin to your `app.config.ts`:

```ts
export default {
	plugins: ["@opencoder/expo-plugins"],
};
```

## Plugins

### withBunReactNativeGradlePlugin

Adds a Bun-specific fallback when resolving the React Native Gradle plugin path in `android/settings.gradle`.

## Build

```bash
bun run build
```
