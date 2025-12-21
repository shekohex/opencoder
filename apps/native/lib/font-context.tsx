import type React from "react";
import { createContext, useContext, useState } from "react";

import {
	type FontRole,
	type FontWeight,
	getFontFamily,
	type MonoFamily,
	type MonoFlavor,
	type SansFamily,
} from "./font-registry";
import { storage } from "./storage";

const KEYS = {
	SANS_SET: "font_sans_set",
	MONO_SET: "font_mono_set",
	MONO_FLAVOR: "font_mono_flavor",
};

interface FontContextType {
	sansSet: SansFamily;
	monoSet: MonoFamily;
	monoFlavor: MonoFlavor;
	setSansSet: (family: SansFamily) => void;
	setMonoSet: (family: MonoFamily) => void;
	setMonoFlavor: (flavor: MonoFlavor) => void;
	isNerdEnabled: boolean;
	resolveFont: (role: FontRole, weight?: FontWeight) => string;
}

const FontContext = createContext<FontContextType | null>(null);

export function FontProvider({ children }: { children: React.ReactNode }) {
	// Load initial state from storage or defaults
	// We use lazy initialization to read from storage only once
	const [sansSet, setSansSetState] = useState<SansFamily>(
		() => (storage.getString(KEYS.SANS_SET) as SansFamily) || "Inter",
	);
	const [monoSet, setMonoSetState] = useState<MonoFamily>(
		() => (storage.getString(KEYS.MONO_SET) as MonoFamily) || "IBMPlexMono",
	);
	const [monoFlavor, setMonoFlavorState] = useState<MonoFlavor>(
		() => (storage.getString(KEYS.MONO_FLAVOR) as MonoFlavor) || "normal",
	);

	const setSansSet = (family: SansFamily) => {
		setSansSetState(family);
		storage.set(KEYS.SANS_SET, family);
	};

	const setMonoSet = (family: MonoFamily) => {
		setMonoSetState(family);
		storage.set(KEYS.MONO_SET, family);
	};

	const setMonoFlavor = (flavor: MonoFlavor) => {
		setMonoFlavorState(flavor);
		storage.set(KEYS.MONO_FLAVOR, flavor);
	};

	const isNerdEnabled = monoFlavor === "nerd";

	const resolveFont = (role: FontRole, weight: FontWeight = 400) => {
		return getFontFamily({
			role,
			weight,
			family: role === "sans" ? sansSet : monoSet,
			flavor: role === "mono" ? monoFlavor : undefined,
		});
	};

	return (
		<FontContext.Provider
			value={{
				sansSet,
				monoSet,
				monoFlavor,
				setSansSet,
				setMonoSet,
				setMonoFlavor,
				isNerdEnabled,
				resolveFont,
			}}
		>
			{children}
		</FontContext.Provider>
	);
}

export function useFontsConfig() {
	const context = useContext(FontContext);
	if (!context) {
		throw new Error("useFontsConfig must be used within a FontProvider");
	}
	return context;
}
