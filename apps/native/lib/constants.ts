import { semanticColors } from "./tokens";

export const NAV_THEME = {
	light: {
		background: semanticColors.light.background.base,
		border: semanticColors.light.border.base,
		card: semanticColors.light.background.stronger,
		notification: semanticColors.light.surface.criticalStrong,
		primary: semanticColors.light.text.interactive,
		text: semanticColors.light.text.strong,
	},
	dark: {
		background: semanticColors.dark.background.base,
		border: semanticColors.dark.border.base,
		card: semanticColors.dark.background.stronger,
		notification: semanticColors.dark.surface.criticalStrong,
		primary: semanticColors.dark.text.interactive,
		text: semanticColors.dark.text.strong,
	},
};
