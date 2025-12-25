export const colors = {
	absoluteBlack: "#000000",
	pureWhite: "#FFFFFF",
	midGray: "#888888",
	prefixLight: "#BBBBBB",
	darkGray: "#444444",
	highlight: "#D1D1D1",
} as const;

export const brandColors = {
	light: {
		open: colors.midGray,
		coder: colors.absoluteBlack,
		outer: colors.absoluteBlack,
		inner: colors.pureWhite,
	},
	dark: {
		open: colors.prefixLight,
		coder: colors.pureWhite,
		outer: colors.pureWhite,
		inner: colors.absoluteBlack,
	},
} as const;
