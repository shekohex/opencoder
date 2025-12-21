# Themes

This directory contains the Uniwind theme definitions for the native app (iOS/Android/web).

## How theming works

- Our UI uses semantic Tailwind/Uniwind classNames (e.g. `bg-background`, `text-foreground`).
- Those semantic colors are backed by CSS variables defined in `apps/native/themes/*.css`.
- The active theme is applied at runtime from `apps/native/lib/theme-context.tsx` via `Uniwind.setTheme(...)`.

We treat the built-in Uniwind `light` / `dark` themes as the "OpenCode" theme.
Additional themes are modeled as `name-mode` (e.g. `dracula-dark`).

## Files

- `apps/native/global.css`: imports Uniwind + all theme files.
- `apps/native/themes/opencode.css`: defines `@variant light` and `@variant dark`.
- `apps/native/themes/dracula.css`: defines `@variant dracula-light` and `@variant dracula-dark`.
- `apps/native/themes/nord.css`: defines `@variant nord-light` and `@variant nord-dark`.
- `apps/native/metro.config.js`: registers custom themes via `extraThemes`.

## Validating themes

Run the static validator any time you add or edit a theme:

- From `apps/native/`:
  - `bun run validate-themes`
- From repo root:
  - `bun --cwd apps/native run validate-themes`

What it checks:
- Every `@variant` in `apps/native/themes/*.css` defines the exact same CSS variable set as `@variant light`.
- Every entry in `apps/native/metro.config.js` `extraThemes` exists as an `@variant` in the theme CSS.

Output:
- Success prints JSON with counts.
- Failure exits non-zero with a numbered, detailed error list.

## Adding a new theme

Example: add theme `solarized`.

### 1) Create a CSS file

Create `apps/native/themes/solarized.css`:

```css
@layer theme {
  :root {
    @variant solarized-light {
      /* define ALL variables used by the app */
      --background: #fdf6e3;
      --text-color: #657b83;
      /* ... */
    }
  }

  :root {
    @variant solarized-dark {
      --background: #002b36;
      --text-color: #93a1a1;
      /* ... */
    }
  }
}
```

Important: every theme variant must define the exact same set of variables.

### 2) Import it from `global.css`

Add:

```css
@import "./themes/solarized.css";
```

### 3) Register it in `metro.config.js`

Add both variants:

```js
const extraThemes = [
  // ...
  "solarized-light",
  "solarized-dark",
]
```

Then restart Metro/Expo (`bun run dev` / `bun run web`).

### 4) Register it in the TS theme registry

Update:
- `apps/native/lib/themes.ts`: add a `solarized` entry with `light`/`dark` `SemanticColors`.
- `apps/native/lib/theme-context.tsx`: no changes needed if you follow `name-light`/`name-dark`.

## References

- Uniwind Custom Themes: https://docs.uniwind.dev/theming/custom-themes
- Uniwind updateCSSVariables: https://docs.uniwind.dev/theming/update-css-variables

## FAQ

### Why do we need themes in both TypeScript and CSS?

In a pure web app, you usually only need CSS variables. However, in **React Native** with **Expo**, we need both for different parts of the system:

#### 1. CSS Files (`themes/*.css` -> Uniwind/Tailwind)

**Purpose:** Styling UI Components.
This is what powers your Tailwind classes like `bg-background`, `text-foreground`, `border-border`.

- **Engine:** The `uniwind` compiler reads these CSS variables at build/runtime to generate the native styles for React Native `View`, `Text`, etc.
- **Scope:** Any component using `className="..."`.

#### 2. TypeScript Definitions (`lib/themes.ts`)

**Purpose:** Configuring Native System & Libraries.
React Native libraries often require raw hex strings (e.g., `"#FF0000"`) and cannot read CSS variables.

- **React Navigation:** The navigation bar, tab bar, and headers are native views controlled by the navigation library. We must pass it a JS object (`ResolvedTheme`) so it knows what color to paint the header background or the tab icons.
- **Status Bar & System UI:** Setting the Android navigation bar color or iOS status bar style often requires imperative JS calls with hex codes.
- **Canvas / 3D:** If you ever add charts (Skia) or 3D (Three.js), they usually need raw color values passed as props, not CSS classes.

**In summary:**

- **CSS** = For the code you write (React components).
- **TS** = For the code libraries write (Navigation, Native Modules).

We keep them in sync so the "header" (Native) matches the "page background" (CSS).
