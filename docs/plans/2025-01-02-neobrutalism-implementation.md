# Neo-brutalism Design System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement Neo-brutalist design system across React Native app with thick borders, hard shadows, and bold aesthetics while maintaining existing theme color flexibility.

**Architecture:** Two-layer system - Design shapes (borders, shadows, corners) applied globally, colors provided by themes (neobrutalism default, 36 existing alternatives).

**Tech Stack:** React Native, Expo ~54.0, Uniwind (Tailwind), TypeScript, Context for theming

---

## Phase 1: Foundation (Tokens & Theme)

### Task 1: Create Neo-brutalism Design Tokens

**Files:**
- Create: `apps/native/lib/neobrutalism-tokens.ts`

**Step 1: Create design token constants**

```typescript
// apps/native/lib/neobrutalism-tokens.ts
export const neoTokens = {
  border: {
    thin: 2,
    default: 4,
    thick: 8,
  },
  shadow: {
    small: { width: 4, height: 0 },
    medium: { width: 8, height: 0 },
    large: { width: 12, height: 0 },
    massive: { width: 16, height: 0 },
  },
  radius: {
    sharp: 0,
    pill: 9999,
  },
} as const;

export type NeoShadowKey = keyof typeof neoTokens.shadow;
```

**Step 2: Verify TypeScript compiles**

Run: `bun run check-types`
Expected: No errors

**Step 3: Commit**

```bash
git add apps/native/lib/neobrutalism-tokens.ts
git commit -m "feat: add neo-brutalism design tokens"
```

---

### Task 2: Add Neo-brutalism Color Theme

**Files:**
- Modify: `apps/native/lib/themes.ts`

**Step 1: Add neobrutalism to THEME_NAMES array**

At line 4, after `"opencoder"`:

```typescript
export const THEME_NAMES = [
	"neobrutalism",
	"opencoder",
	// ... rest of themes
] as const;
```

**Step 2: Add theme definition**

Before `const themes: Record<ThemeName, ThemeDefinition>` (around line 4343):

```typescript
const neobrutalismTheme: ThemeDefinition = {
	light: {
		background: {
			base: "#FFFDF5",      // cream
			weak: "#FFF9E6",
			strong: "#FFFFFF",
			stronger: "#FFF6D9",
		},
		surface: {
			base: "#00000012",
			hover: "#0000001f",
			active: "#00000029",
			weak: "#0000001a",
			strong: "#FFFFFF",
			brand: "#FF6B6B",      // hot red accent
			brandHover: "#FF5252",
			interactive: "#FFD93D33", // yellow transparent
			interactiveHover: "#FFD93D66",
			success: "#FFD93D33",
			successStrong: "#FFD93D",
			warning: "#C4B5FD33",  // violet
			warningStrong: "#C4B5FD",
			critical: "#FF6B6B33",
			criticalStrong: "#FF6B6B",
			info: "#C4B5FD33",
			infoStrong: "#C4B5FD",
		},
		text: {
			base: "#000000",
			weak: "#333333",
			weaker: "#666666",
			strong: "#000000",
			interactive: "#FF6B6B",
			success: "#FFD93D",
			critical: "#FF6B6B",
			warning: "#C4B5FD",
		},
		border: {
			base: "#000000",
			hover: "#000000",
			active: "#000000",
			weak: "#000000",
			strong: "#000000",
			selected: "#FF6B6B",
			interactive: "#FF6B6B",
			success: "#FFD93D",
			warning: "#C4B5FD",
			critical: "#FF6B6B",
			info: "#C4B5FD",
		},
		icon: {
			base: "#000000",
			hover: "#000000",
			active: "#000000",
			weak: "#666666",
			strong: "#000000",
			interactive: "#FF6B6B",
			success: "#FFD93D",
			warning: "#C4B5FD",
			critical: "#FF6B6B",
			info: "#C4B5FD",
		},
		input: {
			base: "#FFFFFF",
			hover: "#FFFDF5",
			active: "#FFFDF5",
			selected: "#FFD93D33",
			disabled: "#E5E5E5",
		},
	},
	dark: {
		// Neo-brutalism is light-mode focused, dark uses inverted colors
		background: {
			base: "#000000",
			weak: "#1A1A1A",
			strong: "#FFFFFF",
			stronger: "#333333",
		},
		surface: {
			base: "#FFFFFF12",
			hover: "#FFFFFF1f",
			active: "#FFFFFF29",
			weak: "#FFFFFF1a",
			strong: "#1A1A1A",
			brand: "#FF6B6B",
			brandHover: "#FF5252",
			interactive: "#FFD93D33",
			interactiveHover: "#FFD93D66",
			success: "#FFD93D33",
			successStrong: "#FFD93D",
			warning: "#C4B5FD33",
			warningStrong: "#C4B5FD",
			critical: "#FF6B6B33",
			criticalStrong: "#FF6B6B",
			info: "#C4B5FD33",
			infoStrong: "#C4B5FD",
		},
		text: {
			base: "#FFFFFF",
			weak: "#CCCCCC",
			weaker: "#999999",
			strong: "#FFFFFF",
			interactive: "#FF6B6B",
			success: "#FFD93D",
			critical: "#FF6B6B",
			warning: "#C4B5FD",
		},
		border: {
			base: "#FFFFFF",
			hover: "#FFFFFF",
			active: "#FFFFFF",
			weak: "#FFFFFF",
			strong: "#FFFFFF",
			selected: "#FF6B6B",
			interactive: "#FF6B6B",
			success: "#FFD93D",
			warning: "#C4B5FD",
			critical: "#FF6B6B",
			info: "#C4B5FD",
		},
		icon: {
			base: "#FFFFFF",
			hover: "#FFFFFF",
			active: "#FFFFFF",
			weak: "#999999",
			strong: "#FFFFFF",
			interactive: "#FF6B6B",
			success: "#FFD93D",
			warning: "#C4B5FD",
			critical: "#FF6B6B",
			info: "#C4B5FD",
		},
		input: {
			base: "#1A1A1A",
			hover: "#000000",
			active: "#000000",
			selected: "#FFD93D33",
			disabled: "#333333",
		},
	},
};
```

**Step 3: Add to themes object**

In `themes` object (around line 4343):

```typescript
export const themes: Record<ThemeName, ThemeDefinition> = {
	neobrutalism: neobrutalismTheme,
	opencoder: opencoderTheme,
	// ... rest
};
```

**Step 4: Add display name**

In `themeDisplayNames` object (around line 4378):

```typescript
export const themeDisplayNames: Record<ThemeName, string> = {
	neobrutalism: "Neo-brutalism",
	opencoder: "OpenCoder",
	// ... rest
};
```

**Step 5: Verify TypeScript compiles**

Run: `bun run check-types`
Expected: No errors

**Step 6: Commit**

```bash
git add apps/native/lib/themes.ts
git commit -m "feat: add neobrutalism color theme"
```

---

### Task 3: Add Global Neo-brutalism Utility Classes

**Files:**
- Modify: `apps/native/global.css`

**Step 1: Add neo-brutalism utility classes**

At the end of `global.css`:

```css
/* Neo-brutalism utilities */
.neo-border-thin { border-width: 2px; }
.neo-border { border-width: 4px; }
.neo-border-thick { border-width: 8px; }

.neo-shadow-sm {
  shadow-offset: 4px 0px;
  shadow-radius: 0px;
  shadow-color: #000;
  shadow-opacity: 1;
  elevation: 4;
}

.neo-shadow-md {
  shadow-offset: 8px 0px;
  shadow-radius: 0px;
  shadow-color: #000;
  shadow-opacity: 1;
  elevation: 8;
}

.neo-shadow-lg {
  shadow-offset: 12px 0px;
  shadow-radius: 0px;
  shadow-color: #000;
  shadow-opacity: 1;
  elevation: 12;
}

.neo-shadow-xl {
  shadow-offset: 16px 0px;
  shadow-radius: 0px;
  shadow-color: #000;
  shadow-opacity: 1;
  elevation: 16;
}

/* For white shadows on dark backgrounds */
.neo-shadow-white-sm {
  shadow-offset: 4px 0px;
  shadow-radius: 0px;
  shadow-color: #fff;
  shadow-opacity: 1;
  elevation: 4;
}
```

**Step 2: Verify CSS is valid**

Run: `bun run check`
Expected: No linting errors

**Step 3: Commit**

```bash
git add apps/native/global.css
git commit -m "feat: add neo-brutalism utility classes"
```

---

## Phase 2: Primitive Components

### Task 4: Redesign Button Component

**Files:**
- Modify: `apps/native/components/button.tsx`

**Step 1: Update VARIANTS constant**

Replace the entire `VARIANTS` object (around line 32):

```typescript
const VARIANTS: Record<ButtonVariant, string> = {
	primary:
		"bg-surface-brand border-black hover:bg-surface-brandHover active:bg-surface-brand",
	secondary:
		"bg-white border-black hover:bg-surface-hover active:bg-surface-active",
	ghost:
		"bg-transparent border-transparent hover:border-black hover:bg-surface-hover active:bg-surface-active",
	danger:
		"bg-surface-criticalStrong border-black hover:bg-surface-critical/90 active:bg-surface-critical/80",
	outline:
		"bg-white border-black hover:bg-surface-hover active:bg-surface-active",
};
```

**Step 2: Update SIZES for neo-brutalism**

Replace `SIZES` constant (around line 45):

```typescript
const SIZES: Record<ButtonSize, string> = {
	sm: "h-10 px-4 rounded-none gap-2",
	md: "h-12 px-6 rounded-none gap-2",
	lg: "h-14 px-8 rounded-none gap-3",
};
```

**Step 3: Update base styles**

Replace `baseStyles` (around line 74):

```typescript
const baseStyles =
	"flex-row items-center justify-center border-4 border-black font-bold uppercase tracking-wide transition-all duration-100";
```

**Step 4: Add shadow and press effect**

After `disabledStyles`, add shadow styles:

```typescript
const shadowStyles = disabled
	? ""
	: "neo-shadow-md active:neo-shadow-sm active:translate-x-[2px] active:translate-y-[2px]";
```

**Step 5: Update className in Pressable**

Update the className prop (around line 98):

```typescript
className={`${baseStyles} ${variantStyles} ${sizeStyles} ${disabledStyles} ${shadowStyles} ${className}`}
```

**Step 6: Update typography for neo-brutalism**

Update `TEXT_SIZES` (around line 51):

```typescript
const TEXT_SIZES: Record<ButtonSize, string> = {
	sm: "text-sm",
	md: "text-base",
	lg: "text-lg",
};
```

**Step 7: Verify TypeScript compiles**

Run: `bun run check-types`
Expected: No errors

**Step 8: Commit**

```bash
git add apps/native/components/button.tsx
git commit -m "feat(button): apply neo-brutalist styling"
```

---

### Task 5: Redesign Card Component

**Files:**
- Modify: `apps/native/components/card.tsx`

**Step 1: Update Card component**

Replace the entire `Card` function:

```typescript
export function Card({ className = "", ...props }: ViewProps) {
	return (
		<View
			className={`rounded-none border-4 border-black bg-white neo-shadow-md ${className}`}
			{...props}
		/>
	);
}
```

**Step 2: Add hover effect support**

Update to support hover (React Native web):

```typescript
export function Card({ className = "", ...props }: ViewProps) {
	return (
		<View
			className={`rounded-none border-4 border-black bg-white neo-shadow-md hover:-translate-y-2 hover:neo-shadow-lg transition-all duration-200 ${className}`}
			{...props}
		/>
	);
}
```

**Step 3: Update CardHeader for optional styled variant**

Replace `CardHeader`:

```typescript
export function CardHeader({ className = "", ...props }: ViewProps) {
	return <View className={`border-b-4 border-black bg-surface-muted/20 ${className}`} {...props} />;
}
```

**Step 4: Verify TypeScript compiles**

Run: `bun run check-types`
Expected: No errors

**Step 5: Commit**

```bash
git add apps/native/components/card.tsx
git commit -m "feat(card): apply neo-brutalist styling"
```

---

### Task 6: Redesign TextField Component

**Files:**
- Modify: `apps/native/components/text-field.tsx`

**Step 1: Update Input baseStyles**

Replace `baseStyles` in `Input` function (around line 113):

```typescript
const baseStyles =
	"h-12 w-full rounded-none border-4 border-black bg-white px-4 py-3 text-lg font-bold text-foreground placeholder:text-black/40";
```

**Step 2: Update focusStyles for yellow background**

Replace `focusStyles` (around line 115):

```typescript
const focusStyles = isFocused
	? "bg-surface-warningStrong neo-shadow-sm"
	: "";
```

**Step 3: Update invalidStyles**

Replace `invalidStyles` (around line 118):

```typescript
const invalidStyles = isInvalid
	? "border-black bg-surface-criticalStrong"
	: "";
```

**Step 4: Update Label styling**

Update `Label` className (around line 87):

```typescript
className={`font-black uppercase tracking-widest text-black text-base ${
	isDisabled ? "opacity-50" : ""
} ${className}`}
```

**Step 5: Update Description styling**

Update `Description` className (around line 167):

```typescript
className={`text-black/70 text-base ${className}`}
```

**Step 6: Update ErrorMessage styling**

Update `ErrorMessage` className (around line 187):

```typescript
className={`font-black uppercase text-surface-criticalStrong text-base ${className}`}
```

**Step 7: Verify TypeScript compiles**

Run: `bun run check-types`
Expected: No errors

**Step 8: Commit**

```bash
git add apps/native/components/text-field.tsx
git commit -m "feat(text-field): apply neo-brutalist styling"
```

---

### Task 7: Create Badge Component

**Files:**
- Create: `apps/native/components/badge.tsx`

**Step 1: Create Badge component**

```typescript
import type { ViewProps } from "react-native";
import { View } from "react-native";
import { AppText } from "./app-text";

export interface BadgeProps extends ViewProps {
	variant?: "accent" | "secondary" | "muted";
	children: string;
	rotation?: number;
}

export function Badge({
	variant = "accent",
	children,
	rotation = 0,
	className = "",
	...props
}: BadgeProps) {
	const variantStyles = {
		accent: "bg-surface-brand text-white",
		secondary: "bg-surface-warningStrong text-black",
		muted: "bg-surface-infoStrong text-black",
	};

	const rotateStyle = rotation !== 0 ? { transform: [{ rotate: `${rotation}deg` }] } : {};

	return (
		<View
			className={`rounded-full border-4 border-black px-4 py-2 neo-shadow-sm ${variantStyles[variant]} ${className}`}
			style={rotateStyle}
			{...props}
		>
			<AppText className="font-black uppercase tracking-widest text-sm text-center">
				{children}
			</AppText>
		</View>
	);
}
```

**Step 2: Export from components index**

Check if `apps/native/components/index.ts` exists and add:

```typescript
export * from "./badge";
```

**Step 3: Verify TypeScript compiles**

Run: `bun run check-types`
Expected: No errors

**Step 4: Commit**

```bash
git add apps/native/components/badge.tsx
git add apps/native/components/index.ts
git commit -m "feat: add neo-brutalist badge component"
```

---

## Phase 3: Compound Components

### Task 8: Redesign Accordion Component

**Files:**
- Modify: `apps/native/components/accordion.tsx`

**Step 1: Find accordion component file**

Check: `ls apps/native/components/accordion*`

**Step 2: Update container styling**

Add neo-brutalist classes to accordion container:
- `border-4 border-black` for thick border
- `rounded-none` for sharp corners
- `neo-shadow-md` for hard shadow

**Step 3: Update header styling**

Add:
- `border-b-4 border-black` for separator
- `bg-surface-muted/20` for colored background

**Step 4: Update trigger for press effect**

Add:
- `active:translate-x-[2px] active:translate-y-[2px]` for mechanical press
- `active:neo-shadow-sm` for shadow change on press

**Step 5: Verify and commit**

Run: `bun run check-types`
Expected: No errors

```bash
git add apps/native/components/accordion.tsx
git commit -m "feat(accordion): apply neo-brutalist styling"
```

---

### Task 9: Redesign Dialog Component

**Files:**
- Modify: `apps/native/components/dialog.tsx`

**Step 1: Find dialog component file**

Check: `ls apps/native/components/dialog*`

**Step 2: Update overlay**

Add semi-transparent background with `bg-black/50`

**Step 3: Update panel styling**

Add:
- `border-4 border-black`
- `rounded-none`
- `bg-white`
- `neo-shadow-xl` for massive shadow

**Step 4: Update close button**

Style as bordered box:
- `border-4 border-black`
- `bg-surface-muted`
- `neo-shadow-sm`
- Press effect with `active:translate-x-[2px] active:translate-y-[2px]`

**Step 5: Verify and commit**

Run: `bun run check-types`
Expected: No errors

```bash
git add apps/native/components/dialog.tsx
git commit -m "feat(dialog): apply neo-brutalist styling"
```

---

### Task 10: Redesign Select Component

**Files:**
- Modify: `apps/native/components/select.tsx`

**Step 1: Find select component file**

Check: `ls apps/native/components/select*`

**Step 2: Update trigger styling**

Add:
- `border-4 border-black`
- `rounded-none`
- `bg-white`
- `neo-shadow-sm`

**Step 3: Update dropdown styling**

Add:
- `border-4 border-black`
- `bg-white`
- `neo-shadow-lg`

**Step 4: Update option hover**

Add left border strip on hover:
- `hover:border-l-8 hover:border-l-black`

**Step 5: Verify and commit**

Run: `bun run check-types`
Expected: No errors

```bash
git add apps/native/components/select.tsx
git commit -m "feat(select): apply neo-brutalist styling"
```

---

### Task 11: Redesign Tabs Component

**Files:**
- Modify: `apps/native/components/tabs.tsx`

**Step 1: Find tabs component file**

Check: `ls apps/native/components/tabs*`

**Step 2: Update list styling**

Add:
- `border-b-4 border-black`

**Step 3: Update trigger styling**

Add:
- `border-4 border-black border-b-0`
- `rounded-none`
- Press effect: `active:translate-x-[2px] active:translate-y-[2px]`

**Step 4: Update active state**

Use brand color for active:
- `bg-surface-brand text-white`

**Step 5: Verify and commit**

Run: `bun run check-types`
Expected: No errors

```bash
git add apps/native/components/tabs.tsx
git commit -m "feat(tabs): apply neo-brutalist styling"
```

---

### Task 12: Redesign BottomSheet Component

**Files:**
- Modify: `apps/native/components/bottom-sheet.tsx`

**Step 1: Find bottom-sheet component file**

Check: `ls apps/native/components/bottom-sheet*`

**Step 2: Update sheet styling**

Add:
- `border-4 border-black`
- `bg-white`
- `rounded-none` (sharp corners, but handle bottom rounded if needed)

**Step 3: Update handle styling**

Style as bordered pill:
- `border-4 border-black`
- `bg-surface-muted`
- `rounded-full`
- `neo-shadow-sm`

**Step 4: Update backdrop**

Use semi-transparent: `bg-black/50`

**Step 5: Verify and commit**

Run: `bun run check-types`
Expected: No errors

```bash
git add apps/native/components/bottom-sheet.tsx
git commit -m "feat(bottom-sheet): apply neo-brutalist styling"
```

---

## Phase 4: Testing & Verification

### Task 13: Run Quality Checks

**Step 1: Run TypeScript checks**

Run: `bun run check-types`
Expected: No errors

**Step 2: Run linter**

Run: `bun run check`
Expected: No linting errors

**Step 3: Run tests**

Run: `bun run test`
Expected: All tests pass

**Step 4: Create example screen to verify**

Create test screen at `apps/native/app/(tabs)/_test-neo.tsx`:

```typescript
import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { TextField } from "@/components/text-field";
import { Badge } from "@/components/badge";
import { View } from "react-native";

export default function NeoTestScreen() {
	return (
		<View className="flex-1 gap-8 bg-background p-8">
			<Badge variant="accent">New Badge</Badge>
			<Badge variant="secondary" rotation={-2}>Rotated Badge</Badge>

			<View className="flex-row gap-4">
				<Button variant="primary">Primary Button</Button>
				<Button variant="secondary">Secondary</Button>
				<Button variant="outline">Outline</Button>
			</View>

			<Card className="p-6">
				<CardHeader>
					<CardTitle>
						<TextField.Label>Test Input</TextField.Label>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<TextField>
						<TextField.Input placeholder="Enter text..." />
						<TextField.Description>This is a neo-brutalist input</TextField.Description>
					</TextField>
				</CardContent>
			</Card>
		</View>
	);
}
```

**Step 5: Test in app**

Run: `bunx expo start`
Expected: App runs without errors, neo-brutalist styling visible

**Step 6: Clean up test file**

```bash
rm apps/native/app/(tabs)/_test-neo.tsx
git add apps/native/app/(tabs)/_test-neo.tsx
```

**Step 7: Final commit**

```bash
git commit -m "test: add and remove neo-brutalism test screen"
```

---

## Task Summary

- **13 tasks** covering tokens, theme, and all primitive + compound components
- **Estimated changes**: 15+ files
- **Key changes**: Thick borders, hard shadows, sharp corners, mechanical press effects
- **Theme flexibility**: Colors themeable, shapes fixed as neo-brutalist
