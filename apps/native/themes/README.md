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
