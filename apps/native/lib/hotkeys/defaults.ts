import type { HotkeyMap } from "./types";

export const defaultHotkeys = {
	"global.search": {
		keys: "meta+k",
		description: "Open command palette",
		preventDefault: true,
	},
	"global.settings": {
		keys: "meta+,",
		description: "Open settings",
		preventDefault: true,
	},
	"dialog.close": {
		keys: "esc",
		scopes: ["dialog"],
		description: "Close active dialog",
		preventDefault: true,
	},
	"dialog.confirm": {
		keys: "enter",
		scopes: ["dialog"],
		description: "Confirm dialog action",
		preventDefault: true,
	},
	"demo.global_alert": {
		keys: "t",
		description: "Trigger a global demo alert",
		preventDefault: true,
	},
	"demo.scoped_alert": {
		keys: "s",
		scopes: ["demo-scope"],
		description: "Trigger a scoped demo alert",
		preventDefault: true,
	},
} as const satisfies HotkeyMap;

export type ActionId = keyof typeof defaultHotkeys;
