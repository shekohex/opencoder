import { type SemanticColors, semanticColors } from "./tokens";

export const THEME_NAMES = ["opencode", "dracula", "nord"] as const;
export type ThemeName = (typeof THEME_NAMES)[number];

export type ThemeMode = "light" | "dark";

export type ThemeDefinition = {
	light: SemanticColors;
	dark: SemanticColors;
};

type NavThemeColors = {
	background: string;
	border: string;
	card: string;
	notification: string;
	primary: string;
	text: string;
};

export type ResolvedTheme = SemanticColors & {
	navTheme: NavThemeColors;
};

const opencodeTheme: ThemeDefinition = {
	light: semanticColors.light,
	dark: semanticColors.dark,
};

const draculaTheme: ThemeDefinition = {
	light: {
		background: {
			base: "#f8f8f2",
			weak: "#e8e8e2",
			strong: "#ffffff",
			stronger: "#fafafa",
		},
		surface: {
			base: "#e8e8e210",
			hover: "#d8d8d220",
			active: "#c8c8c230",
			weak: "#e8e8e230",
			strong: "#ffffff",
			brand: "#bd93f9",
			brandHover: "#a87bf5",
			interactive: "#bd93f920",
			interactiveHover: "#bd93f940",
			success: "#50fa7b20",
			successStrong: "#50fa7b",
			warning: "#f1fa8c20",
			warningStrong: "#f1fa8c",
			critical: "#ff555520",
			criticalStrong: "#ff5555",
			info: "#ffb86c20",
			infoStrong: "#ffb86c",
		},
		text: {
			base: "#44475a",
			weak: "#6272a4",
			weaker: "#8b95b3",
			strong: "#282a36",
			interactive: "#bd93f9",
			success: "#3d9a57",
			critical: "#c94f55",
			warning: "#a89818",
		},
		border: {
			base: "#c8c8c280",
			hover: "#b8b8b8",
			active: "#a8a8a8",
			weak: "#d8d8d260",
			strong: "#c8c8c2",
			selected: "#bd93f9",
			interactive: "#bd93f9",
			success: "#50fa7b80",
			warning: "#f1fa8c80",
			critical: "#ff555580",
			info: "#ffb86c80",
		},
		icon: {
			base: "#6272a4",
			hover: "#44475a",
			active: "#282a36",
			weak: "#8b95b3",
			strong: "#282a36",
			interactive: "#bd93f9",
			success: "#50fa7b",
			warning: "#f1fa8c",
			critical: "#ff5555",
			info: "#ffb86c",
		},
		input: {
			base: "#ffffff",
			hover: "#f8f8f2",
			active: "#f0f0ea",
			selected: "#bd93f920",
			disabled: "#e8e8e2",
		},
	},
	dark: {
		background: {
			base: "#282a36",
			weak: "#21222c",
			strong: "#1e1f29",
			stronger: "#232530",
		},
		surface: {
			base: "#44475a20",
			hover: "#44475a40",
			active: "#44475a60",
			weak: "#44475a30",
			strong: "#44475a",
			brand: "#bd93f9",
			brandHover: "#a87bf5",
			interactive: "#bd93f930",
			interactiveHover: "#bd93f950",
			success: "#50fa7b20",
			successStrong: "#50fa7b",
			warning: "#f1fa8c20",
			warningStrong: "#f1fa8c",
			critical: "#ff555520",
			criticalStrong: "#ff5555",
			info: "#ffb86c20",
			infoStrong: "#ffb86c",
		},
		text: {
			base: "#f8f8f2",
			weak: "#6272a4",
			weaker: "#545a75",
			strong: "#ffffff",
			interactive: "#bd93f9",
			success: "#50fa7b",
			critical: "#ff5555",
			warning: "#f1fa8c",
		},
		border: {
			base: "#44475a",
			hover: "#545a75",
			active: "#6272a4",
			weak: "#373a4a",
			strong: "#545a75",
			selected: "#bd93f9",
			interactive: "#bd93f9",
			success: "#50fa7b60",
			warning: "#f1fa8c60",
			critical: "#ff555560",
			info: "#ffb86c60",
		},
		icon: {
			base: "#6272a4",
			hover: "#8b95b3",
			active: "#f8f8f2",
			weak: "#44475a",
			strong: "#f8f8f2",
			interactive: "#bd93f9",
			success: "#50fa7b",
			warning: "#f1fa8c",
			critical: "#ff5555",
			info: "#ffb86c",
		},
		input: {
			base: "#21222c",
			hover: "#282a36",
			active: "#44475a",
			selected: "#bd93f920",
			disabled: "#373a4a",
		},
	},
};

const nordTheme: ThemeDefinition = {
	light: {
		background: {
			base: "#eceff4",
			weak: "#e5e9f0",
			strong: "#ffffff",
			stronger: "#f8fafc",
		},
		surface: {
			base: "#d8dee910",
			hover: "#d8dee920",
			active: "#d8dee930",
			weak: "#d8dee920",
			strong: "#ffffff",
			brand: "#5e81ac",
			brandHover: "#4c6e95",
			interactive: "#5e81ac20",
			interactiveHover: "#5e81ac40",
			success: "#a3be8c20",
			successStrong: "#a3be8c",
			warning: "#ebcb8b20",
			warningStrong: "#ebcb8b",
			critical: "#bf616a20",
			criticalStrong: "#bf616a",
			info: "#88c0d020",
			infoStrong: "#88c0d0",
		},
		text: {
			base: "#4c566a",
			weak: "#7b88a1",
			weaker: "#9aa3b3",
			strong: "#2e3440",
			interactive: "#5e81ac",
			success: "#78a065",
			critical: "#a5545c",
			warning: "#b5962d",
		},
		border: {
			base: "#d8dee980",
			hover: "#c8d0dc",
			active: "#b8c2d0",
			weak: "#e5e9f060",
			strong: "#d8dee9",
			selected: "#5e81ac",
			interactive: "#81a1c1",
			success: "#a3be8c80",
			warning: "#ebcb8b80",
			critical: "#bf616a80",
			info: "#88c0d080",
		},
		icon: {
			base: "#7b88a1",
			hover: "#4c566a",
			active: "#2e3440",
			weak: "#9aa3b3",
			strong: "#2e3440",
			interactive: "#5e81ac",
			success: "#a3be8c",
			warning: "#ebcb8b",
			critical: "#bf616a",
			info: "#88c0d0",
		},
		input: {
			base: "#ffffff",
			hover: "#f8fafc",
			active: "#eceff4",
			selected: "#5e81ac20",
			disabled: "#e5e9f0",
		},
	},
	dark: {
		background: {
			base: "#2e3440",
			weak: "#272c36",
			strong: "#242931",
			stronger: "#292e38",
		},
		surface: {
			base: "#3b414d20",
			hover: "#3b414d40",
			active: "#3b414d60",
			weak: "#3b414d30",
			strong: "#434c5e",
			brand: "#5e81ac",
			brandHover: "#6b8cb5",
			interactive: "#5e81ac30",
			interactiveHover: "#5e81ac50",
			success: "#a3be8c20",
			successStrong: "#a3be8c",
			warning: "#ebcb8b20",
			warningStrong: "#ebcb8b",
			critical: "#bf616a20",
			criticalStrong: "#bf616a",
			info: "#88c0d020",
			infoStrong: "#88c0d0",
		},
		text: {
			base: "#d8dee9",
			weak: "#7b88a1",
			weaker: "#5c6578",
			strong: "#eceff4",
			interactive: "#81a1c1",
			success: "#a3be8c",
			critical: "#bf616a",
			warning: "#ebcb8b",
		},
		border: {
			base: "#434c5e",
			hover: "#4c566a",
			active: "#5c6578",
			weak: "#3b414d",
			strong: "#4c566a",
			selected: "#81a1c1",
			interactive: "#81a1c1",
			success: "#a3be8c60",
			warning: "#ebcb8b60",
			critical: "#bf616a60",
			info: "#88c0d060",
		},
		icon: {
			base: "#7b88a1",
			hover: "#9aa3b3",
			active: "#d8dee9",
			weak: "#4c566a",
			strong: "#eceff4",
			interactive: "#81a1c1",
			success: "#a3be8c",
			warning: "#ebcb8b",
			critical: "#bf616a",
			info: "#88c0d0",
		},
		input: {
			base: "#3b414d",
			hover: "#434c5e",
			active: "#4c566a",
			selected: "#5e81ac30",
			disabled: "#363c48",
		},
	},
};

export const themes: Record<ThemeName, ThemeDefinition> = {
	opencode: opencodeTheme,
	dracula: draculaTheme,
	nord: nordTheme,
};

export const themeDisplayNames: Record<ThemeName, string> = {
	opencode: "OpenCode",
	dracula: "Dracula",
	nord: "Nord",
};

export function resolveTheme(
	themeName: ThemeName,
	mode: ThemeMode,
): ResolvedTheme {
	const themeColors = themes[themeName][mode];

	const navTheme: NavThemeColors = {
		background: themeColors.background.base,
		border: themeColors.border.base,
		card: themeColors.background.stronger,
		notification: themeColors.surface.criticalStrong,
		primary: themeColors.text.interactive,
		text: themeColors.text.strong,
	};

	return {
		...themeColors,
		navTheme,
	};
}
