import { Platform } from "react-native";
import { createMMKV, type MMKV } from "react-native-mmkv";

// Initialize MMKV only on native platforms to avoid crashes on Web if not polyfilled
let mmkv: MMKV | null = null;

if (Platform.OS !== "web") {
	mmkv = createMMKV({
		id: "opencoder-storage",
	});
}

/**
 * A wrapper around MMKV that falls back to localStorage on Web.
 * This ensures cross-platform persistence compatibility.
 */
export const storage = {
	getString: (key: string): string | undefined => {
		if (Platform.OS === "web") {
			if (typeof localStorage === "undefined") return undefined;
			return localStorage.getItem(key) ?? undefined;
		}
		return mmkv?.getString(key);
	},

	set: (key: string, value: string | boolean | number) => {
		if (Platform.OS === "web") {
			if (typeof localStorage === "undefined") return;
			localStorage.setItem(key, String(value));
			return;
		}
		mmkv?.set(key, value);
	},

	delete: (key: string) => {
		if (Platform.OS === "web") {
			if (typeof localStorage === "undefined") return;
			localStorage.removeItem(key);
			return;
		}
		mmkv?.remove(key);
	},

	getBoolean: (key: string): boolean => {
		if (Platform.OS === "web") {
			if (typeof localStorage === "undefined") return false;
			return localStorage.getItem(key) === "true";
		}
		return mmkv?.getBoolean(key) ?? false;
	},

	getNumber: (key: string): number | undefined => {
		if (Platform.OS === "web") {
			if (typeof localStorage === "undefined") return undefined;
			const value = localStorage.getItem(key);
			return value ? Number.parseFloat(value) : undefined;
		}
		return mmkv?.getNumber(key);
	},
};
