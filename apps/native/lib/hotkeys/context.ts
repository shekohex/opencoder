import { createContext, useContext } from "react";
import type { ActionId } from "./defaults";

export interface HotkeysContextType {
	getKey: (action: ActionId) => string;
	setKey: (action: ActionId, key: string) => void;
	resetAll: () => void;
}

export const HotkeysContext = createContext<HotkeysContextType | null>(null);

export function useHotkeysContext() {
	const context = useContext(HotkeysContext);
	if (!context) {
		throw new Error("useHotkeysContext must be used within a HotkeysProvider");
	}
	return context;
}
