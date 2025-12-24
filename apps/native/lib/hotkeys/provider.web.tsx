import type React from "react";
import { useCallback, useMemo } from "react";
import { HotkeysProvider as RHHKProvider } from "react-hotkeys-hook";
import { useStorageState } from "@/lib/useStorageState";
import { HotkeysContext } from "./context";
import { type ActionId, defaultHotkeys } from "./defaults";

const STORAGE_KEY = "user-hotkeys-overrides";

export function HotkeysProvider({ children }: { children: React.ReactNode }) {
	const [[isLoading, overridesJson], setOverridesJson] =
		useStorageState(STORAGE_KEY);

	const overrides = useMemo(() => {
		try {
			if (isLoading) return {};
			return overridesJson ? JSON.parse(overridesJson) : {};
		} catch {
			return {};
		}
	}, [overridesJson, isLoading]);

	const getKey = useCallback(
		(action: ActionId) => {
			return overrides[action] || defaultHotkeys[action].keys;
		},
		[overrides],
	);

	const setKey = useCallback(
		(action: ActionId, key: string) => {
			const newOverrides = { ...overrides, [action]: key };
			setOverridesJson(JSON.stringify(newOverrides));
		},
		[overrides, setOverridesJson],
	);

	const resetAll = useCallback(() => {
		setOverridesJson(null);
	}, [setOverridesJson]);

	const value = useMemo(
		() => ({ getKey, setKey, resetAll }),
		[getKey, setKey, resetAll],
	);

	return (
		<HotkeysContext.Provider value={value}>
			<RHHKProvider initiallyActiveScopes={[]}>{children}</RHHKProvider>
		</HotkeysContext.Provider>
	);
}
