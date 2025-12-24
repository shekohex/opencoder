import { useHotkeys as useRHHK } from "react-hotkeys-hook";
import { useHotkeysContext } from "./context";
import { type ActionId, defaultHotkeys } from "./defaults";
import type { HotkeyConfig } from "./types";

export function useHotkeys(
	action: ActionId,
	callback: (e: KeyboardEvent) => void,
	options?: {
		enabled?: boolean;
		preventDefault?: boolean;
	},
) {
	const { getKey } = useHotkeysContext();
	const keys = getKey(action);
	const config = defaultHotkeys[action] as HotkeyConfig;

	useRHHK(
		keys,
		(e) => {
			callback(e);
		},
		{
			enabled: options?.enabled ?? true,
			preventDefault: options?.preventDefault ?? config.preventDefault ?? true,
			enableOnFormTags: false,
			...(config.scopes ? { scopes: config.scopes } : {}),
		},
	);
}
