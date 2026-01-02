export const neoTokens = {
	border: {
		thin: 2,
		default: 4,
		thick: 8,
	},
	shadow: {
		small: { width: 4, height: 0 },
		medium: { width: 8, height: 0 },
		large: { width: 12, height: 0 },
		massive: { width: 16, height: 0 },
	},
	radius: {
		sharp: 0,
		pill: 9999,
	},
} as const;

export type NeoShadowKey = keyof typeof neoTokens.shadow;
