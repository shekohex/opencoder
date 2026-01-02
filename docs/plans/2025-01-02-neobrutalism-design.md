# Neo-brutalism Design System Integration

## Overview

Two-layer design system for Opencoder React Native app:
1. **Design Layer**: Neo-brutalist shapes (borders, shadows, corners) applied to ALL components
2. **Theme Layer**: Color palette, user-configurable (neobrutalism default, existing 36 themes as alternatives)

## Design Tokens

### Shapes (lib/neobrutalism-tokens.ts)
```ts
export const neoTokens = {
  border: { default: 4, thin: 2, thick: 8 },
  shadow: {
    small: '4px 4px 0px 0px #000',
    medium: '8px 8px 0px 0px #000',
    large: '12px 12px 0px 0px #000',
    massive: '16px 16px 0px 0px #000'
  },
  radius: { sharp: 0, pill: 9999 },
}
```

### Colors (themes/neobrutalism.css)
```css
:root {
  --color-bg: #FFFDF5;      /* cream canvas */
  --color-fg: #000000;      /* black ink */
  --color-accent: #FF6B6B;  /* hot red */
  --color-secondary: #FFD93D; /* vivid yellow */
  --color-muted: #C4B5FD;   /* soft violet */
  --color-white: #FFFFFF;
}
```

## Component Specifications

### Primitives (Phase 1)

**Button** (`components/button.tsx`)
- Border: `border-4 border-black`
- Shadow: `shadow-[4px_4px_0px_0px_#000]`
- Active state: `active:translate-x-[2px] active:translate-y-[2px] active:shadow-none`
- Typography: `font-bold text-sm uppercase tracking-wide`
- Variants: primary (red), secondary (yellow), outline (white)
- Transition: `duration-100`

**Card** (`components/card.tsx`)
- Border: `border-4 border-black`
- Background: `bg-white`
- Shadow: `shadow-[8px_8px_0px_0px_#000]`
- Hover: `hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_#000]`
- Optional header: `border-b-4 border-black bg-neo-muted/20`

**TextField** (`components/text-field/index.tsx`)
- Border: `border-4 border-black`
- Background: `bg-white`
- Focus: `focus-visible:bg-neo-secondary focus-visible:shadow-[4px_4px_0px_0px_#000]`
- No ring: `focus-visible:outline-none`
- Typography: `font-bold text-lg`

**Badge** (new component, `components/badge.tsx`)
- Shape: `rounded-full`
- Border: `border-4 border-black`
- Background: `bg-neo-accent` or `bg-neo-secondary`
- Typography: `font-black text-sm uppercase tracking-widest`
- Shadow: `shadow-[4px_4px_0px_0px_#000]`
- Optional rotation: `-rotate-2`, `rotate-1`

### Compound Components (Phase 2)

**Accordion** (`components/accordion.tsx`)
- Container: `border-4 border-black bg-white`
- Header: `border-b-4 border-black bg-neo-muted/20`
- Trigger: Mechanical press effect

**Dialog** (`components/dialog.tsx`)
- Overlay: Semi-transparent with noise pattern
- Panel: `border-4 border-black bg-white shadow-[16px_16px_0px_0px_#000]`
- Close button: Bordered box with shadow

**Select** (`components/select.tsx`)
- Trigger: `border-4 border-black` with chevron
- Dropdown: `border-4 border-black bg-white shadow-[12px_12px_0px_0px_#000]`

**Tabs** (`components/tabs.tsx`)
- List: `border-b-4 border-black`
- Trigger: `border-4 border-black border-b-0`, active uses accent

**BottomSheet** (`components/bottom-sheet.tsx`)
- Sheet: `border-4 border-black bg-white`, sharp top corners
- Handle: Bordered pill

### Screens (Phase 3)

**Workspace List** (example)
- Marquee: Scrolling indicators at top
- Cards: Grid with staggered shadows, slight rotations
- Floating badges: Absolute positioning
- Background: Halftone pattern on sections

## Implementation Order

1. **Phase 1**: Primitives (Button, Card, TextField, Badge)
2. **Phase 2**: Compound components (Accordion, Dialog, Select, Tabs, BottomSheet)
3. **Phase 3**: Screens (workspace list, etc.)

## Files to Create/Modify

### New Files
- `lib/neobrutalism-tokens.ts` - Shape tokens
- `themes/neobrutalism.css` - Color theme
- `components/badge.tsx` - New badge component

### Modify Files
- `lib/themes.ts` - Add neobrutalism theme
- `components/button.tsx` - Apply neo styles
- `components/card.tsx` - Apply neo styles
- `components/text-field/index.tsx` - Apply neo styles
- `components/accordion.tsx` - Apply neo styles
- `components/dialog.tsx` - Apply neo styles
- `components/select.tsx` - Apply neo styles
- `components/tabs.tsx` - Apply neo styles
- `components/bottom-sheet.tsx` - Apply neo styles
- Screen components in `apps/native/app/`

## Anti-Patterns to Avoid

- No blur effects (use hard shadows only)
- No opacity/transparency (except texture overlays)
- No subtle grays (use pure black or colors)
- No `rounded-md`, `rounded-lg` (use `rounded-none` or `rounded-full`)
- No smooth gradients (use hard stops or patterns)
