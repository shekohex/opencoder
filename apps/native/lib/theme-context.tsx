import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useColorScheme as useRNColorScheme } from "react-native";
import { createMMKV } from "react-native-mmkv";
import { Uniwind } from "uniwind";
import {
	type ResolvedTheme,
	resolveTheme,
	THEME_NAMES,
	type ThemeMode,
	type ThemeName,
} from "./themes";

const storage = createMMKV({ id: "theme-storage" });

const THEME_KEY = "theme_name";
const MODE_PREFERENCE_KEY = "theme_mode_preference";

export type ThemeModePreference = "system" | "light" | "dark";

type UniwindThemeName = Exclude<
	Parameters<typeof Uniwind.setTheme>[0],
	"system"
>;

interface ThemeContextValue {
	themeName: ThemeName;
	mode: ThemeMode;
	modePreference: ThemeModePreference;
	theme: ResolvedTheme;
	themeVersion: number;
	setThemeName: (name: ThemeName) => void;
	setModePreference: (pref: ThemeModePreference) => void;
	availableThemes: readonly ThemeName[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getStoredThemeName(): ThemeName {
	const stored = storage.getString(THEME_KEY);
	if (stored && THEME_NAMES.includes(stored as ThemeName)) {
		return stored as ThemeName;
	}
	return "opencoder";
}

function getStoredModePreference(): ThemeModePreference {
	const stored = storage.getString(MODE_PREFERENCE_KEY);
	if (stored === "light" || stored === "dark" || stored === "system") {
		return stored;
	}
	return "system";
}

interface ThemeProviderProps {
	children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
	const systemColorScheme = useRNColorScheme();
	const [themeName, setThemeNameState] =
		useState<ThemeName>(getStoredThemeName);
	const [modePreference, setModePreferenceState] =
		useState<ThemeModePreference>(getStoredModePreference);
	const [themeVersion, setThemeVersion] = useState(0);

	const mode: ThemeMode = useMemo(() => {
		if (modePreference === "system") {
			return systemColorScheme ?? "light";
		}
		return modePreference;
	}, [modePreference, systemColorScheme]);

	const theme = useMemo(() => {
		return resolveTheme(themeName, mode);
	}, [themeName, mode]);

	useEffect(() => {
		const uniwindTheme =
			themeName === "opencoder" ? mode : `${themeName}-${mode}`;
		const resolvedTheme = uniwindTheme as UniwindThemeName;

		Uniwind.setTheme(resolvedTheme);
		// Trigger variable invalidation for className-only components.
		Uniwind.updateCSSVariables(resolvedTheme, {});
		setThemeVersion((current) => current + 1);
	}, [themeName, mode]);

	const setThemeName = useCallback((name: ThemeName) => {
		setThemeNameState(name);
		storage.set(THEME_KEY, name);
	}, []);

	const setModePreference = useCallback((pref: ThemeModePreference) => {
		setModePreferenceState(pref);
		storage.set(MODE_PREFERENCE_KEY, pref);
	}, []);

	const value = useMemo<ThemeContextValue>(
		() => ({
			themeName,
			mode,
			modePreference,
			theme,
			themeVersion,
			setThemeName,
			setModePreference,
			availableThemes: THEME_NAMES,
		}),
		[
			themeName,
			mode,
			modePreference,
			theme,
			themeVersion,
			setThemeName,
			setModePreference,
		],
	);

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}

export function useTheme(): ThemeContextValue {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
