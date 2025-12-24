import type React from "react";
import { useCallback, useMemo } from "react";
import { HotkeysContext } from "./context";
import { type ActionId, defaultHotkeys } from "./defaults";

export function HotkeysProvider({ children }: { children: React.ReactNode }) {
	// On native, we just return the default keys and do nothing for storage for now
	// as the hotkeys hook won't fire anyway.

	const getKey = useCallback(
		(action: ActionId) => defaultHotkeys[action].keys,
		[],
	);

	const setKey = useCallback(() => {}, []);
	const resetAll = useCallback(() => {}, []);

	const value = useMemo(
		() => ({ getKey, setKey, resetAll }),
		[getKey, setKey, resetAll],
	);

	return (
		<HotkeysContext.Provider value={value}>{children}</HotkeysContext.Provider>
	);
}
