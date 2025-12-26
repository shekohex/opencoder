# Native UI Components Design

## Overview
Replace custom dialog/select animations with native APIs on iOS/Android to improve UX and feel. Use native APIs where possible: `Alert` for simple confirms, `@expo/react-native-action-sheet` for option menus, and `@gorhom/bottom-sheet` for rich content sheets.

## Current State
- `apps/native/components/dialog.tsx`: Custom `Modal` + reanimated `Fade/Zoom` animations
- `apps/native/components/select.native.tsx`: Custom `Modal` + reanimated `Fade/Slide` bottom panel
- `apps/native/components/select.web.tsx`: Web implementation with DOM layout
- No dedicated bottomsheet component; select panel is closest

## Architecture

### Platform Strategy
- **Web/Desktop**: Keep current custom components and animations
- **iOS/Android (Native)**: Use platform-native APIs
  - Confirm dialogs: `Alert.alert()`
  - Option menus: `@expo/react-native-action-sheet`
  - Rich content sheets: `@gorhom/bottom-sheet`

### API Layer
Create thin wrappers to maintain existing component APIs:

```tsx
// Dialog: confirm/alert
<Dialog title="..." description="..." onConfirm={...} onCancel={...} />

// Select/ActionSheet: option menus
<Select options={[{label,value}]} onSelect={...} onCancel={...} />

// BottomSheet: rich content
<BottomSheet>
  <Content />
  <Footer>
    <Button />
  </Footer>
</BottomSheet>
```

### Platform Branching
- File suffix pattern for implementation splits (`.native.tsx`, `.web.tsx`)
- Runtime `Platform.OS` checks within components when needed
- Shared types and context helpers in `.shared.tsx`

### Dependencies
- `@expo/react-native-action-sheet` - cross‑platform action sheets
- `@gorhom/bottom-sheet` - rich bottom sheets
- `react-native-reanimated` - keep for web/desktop animations only

## Implementation Plan

### Phase 1: Setup & API Definition
1. Install dependencies: `bunx expo install @expo/react-native-action-sheet @gorhom/bottom-sheet`
2. Define shared types for Dialog/Select/BottomSheet APIs
3. Create wrapper components that delegate to platform-specific implementations

### Phase 2: Dialog Migration
1. Update `dialog.tsx` to use `Alert.alert()` on native for simple confirms
2. Remove reanimated animations on native; keep for web/desktop
3. Handle destructive vs cancel button order per platform (iOS: cancel left)

### Phase 3: Select/ActionSheet Migration
1. Update `select.native.tsx` to use `@expo/react-native-action-sheet`
2. Replace custom Modal panel with native action sheet API
3. Remove reanimated Fade/Slide animations on native
4. Keep web/desktop select implementations unchanged

### Phase 4: BottomSheet Component
1. Create new `bottomsheet.native.tsx` using `@gorhom/bottom-sheet`
2. Create `bottomsheet.web.tsx` using existing Modal approach
3. Add shared `bottomsheet.shared.tsx` for types/context
4. Add GestureHandlerRootView wrapper if not present

### Phase 5: UX Validation
1. Verify button order: iOS (cancel left), Android (cancel right or back button)
2. Test dismiss behavior: back button on Android, tap outside
3. Test keyboard avoidance for sheets with inputs
4. Ensure screen reader labels and focus management

### Phase 6: Cleanup
1. Remove unused reanimated code for native paths
2. Update docs/comments to reflect platform differences
3. Run tests, lint, typecheck
4. Test on iOS simulator and Android emulator

## Success Criteria
- No custom animations on iOS/Android for dialogs and selects
- Native feel: platform-specific button order, dismiss behavior
- Option menus use `@expo/react-native-action-sheet` on native
- Rich bottom sheets use `@gorhom/bottom-sheet` on native
- Web/desktop retain current behavior
- All tests, lint, typecheck pass
