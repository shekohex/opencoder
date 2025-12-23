# Accessibility Checklist

## Keyboard Navigation
- [ ] **Focus Order**: Navigation sequence is logical and intuitive.
- [ ] **Focus Visible**: Focus indicator is clearly visible on all interactive elements.
- [ ] **No Keyboard Trap**: User can navigate into and out of all UI components.

## Screen Reader
- [ ] **Labels**: All interactive elements have descriptive labels (`aria-label` or `accessibilityLabel`).
- [ ] **Roles**: Components have appropriate roles (`accessibilityRole`).
- [ ] **State**: Interactive states (expanded, checked, selected) are announced.

## Primitives Checklist

### Dialog
- [ ] Focus moves to the dialog when opened.
- [ ] Focus is trapped within the dialog.
- [ ] Focus returns to the trigger when closed.
- [ ] `Escape` key closes the dialog.

### Select / ListBox
- [x] Listbox can be opened with keyboard.
- [x] Focus moves to the active option.
- [x] Arrow keys navigate options.
- [x] `Enter` or `Space` selects an option.

### Tabs
- [ ] Arrow keys navigate between tabs.
- [ ] `Enter` or `Space` activates the tab.
- [ ] Focus indicator shows active tab.
