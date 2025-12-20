export const palette = {
	smoke: {
		dark: {
			1: "#131010",
			2: "#1b1818",
			3: "#252121",
			4: "#2d2828",
			5: "#343030",
			6: "#3e3939",
			7: "#4b4646",
			8: "#645f5f",
			9: "#716c6b",
			10: "#7f7979",
			11: "#b7b1b1",
			12: "#f1ecec",
		},
		light: {
			1: "#fdfcfc",
			2: "#f9f8f8",
			3: "#f1f0f0",
			4: "#e9e8e8",
			5: "#e2e0e0",
			6: "#dad9d9",
			7: "#cfcecd",
			8: "#bcbbbb",
			9: "#8e8b8b",
			10: "#848181",
			11: "#656363",
			12: "#211e1e",
		},
		darkAlpha: {
			1: "#82383803",
			2: "#e6c6c60b",
			3: "#edd5d516",
			4: "#f2e1e11e",
			5: "#f5e8e826",
			6: "#f5e8e831",
			7: "#f7ecec3f",
			8: "#faf5f559",
			9: "#faf5f467",
			10: "#fbf5f576",
			11: "#fcf9f9b2",
			12: "#fdfbfbf0",
		},
		lightAlpha: {
			1: "#55000003",
			2: "#25000007",
			3: "#1100000f",
			4: "#0c000017",
			5: "#1100001f",
			6: "#07000026",
			7: "#0b060032",
			8: "#04000044",
			9: "#07000074",
			10: "#0400009c",
			11: "#0700007e",
			12: "#020000df",
		},
	},
	cobalt: {
		dark: {
			1: "#091120",
			2: "#0d172b",
			3: "#0c2255",
			4: "#0c2a74",
			5: "#113489",
			6: "#18409b",
			7: "#204cb1",
			8: "#2558d0",
			9: "#034cff",
			10: "#0038ee",
			11: "#89b5ff",
			12: "#cde2ff",
		},
		light: {
			1: "#fcfdff",
			2: "#f5faff",
			3: "#eaf2ff",
			4: "#daeaff",
			5: "#c8e0ff",
			6: "#b4d2ff",
			7: "#98bfff",
			8: "#73a4ff",
			9: "#034cff",
			10: "#0443de",
			11: "#1251ec",
			12: "#0f2b6c",
		},
	},
	yuzu: {
		dark: {
			9: "#fdffca",
			10: "#f4f6c1",
			11: "#dbdda0",
			12: "#eff1bd",
		},
		light: {
			9: "#dcde8d",
			10: "#d2d384",
			11: "#7c7c2c",
			12: "#3d3d23",
		},
	},
	apple: {
		dark: {
			6: "#1d5b19",
			7: "#226c1e",
			8: "#267f20",
			9: "#12c905",
			10: "#17bb0d",
			11: "#37db2e",
			12: "#aff7a8",
		},
		light: {
			2: "#f4fcf3",
			3: "#e1fade",
			6: "#9fe598",
			7: "#7dd676",
			8: "#43c23b",
			9: "#12c905",
			10: "#00bd00",
			11: "#008600",
			12: "#184115",
		},
	},
	ember: {
		dark: {
			2: "#201412",
			3: "#3c140d",
			4: "#530e05",
			5: "#631409",
			6: "#742216",
			7: "#8d3324",
			8: "#b64330",
			9: "#fc533a",
			10: "#ee462d",
			11: "#ff917b",
			12: "#ffd1c8",
		},
		light: {
			1: "#fffcfb",
			2: "#fff6f3",
			3: "#ffe9e4",
			6: "#ffb7a6",
			7: "#ffa392",
			8: "#f68975",
			9: "#fc533a",
			10: "#ef442a",
			11: "#da3319",
			12: "#5c281f",
		},
	},
	solaris: {
		dark: {
			9: "#fcd53a",
		},
		light: {
			2: "#fffbea",
			3: "#fff6be",
			6: "#f2d775",
			7: "#e0c76f",
			9: "#ffdc17",
			10: "#fad337",
			11: "#917500",
		},
	},
	lilac: {
		dark: {
			7: "#6c486e",
			8: "#8a5e8d",
		},
		light: {
			2: "#fdf7fe",
			3: "#fceafd",
			6: "#eebff1",
			7: "#e3a9e7",
			9: "#a753ae",
		},
	},
	mint: {
		dark: {
			5: "#264824",
			8: "#3d7b3b",
			11: "#9dde99",
		},
		light: {
			2: "#f4fcf3",
			5: "#adf2a8",
			9: "#9ff29a",
			11: "#318430",
			12: "#1f461d",
		},
	},
	blue: {
		dark: {
			1: "#0e161f",
			2: "#0f1b2d",
			3: "#0f233c",
			5: "#0e2f57",
			9: "#0091ff",
			11: "#51a8ff",
		},
		light: {
			1: "#f9fcff",
			2: "#f5faff",
			3: "#eaf4ff",
			5: "#cde6fd",
			9: "#0091ff",
		},
	},
	black: "#000000",
	white: "#ffffff",
} as const;

export const semanticColors = {
	light: {
		background: {
			base: "#f8f7f7",
			weak: palette.smoke.light[3],
			strong: palette.smoke.light[1],
			stronger: "#fcfcfc",
		},
		surface: {
			base: palette.smoke.lightAlpha[2],
			hover: "#0500000f",
			active: palette.smoke.lightAlpha[3],
			weak: palette.smoke.lightAlpha[3],
			strong: "#ffffff",
			brand: palette.yuzu.light[9],
			brandHover: palette.yuzu.light[10],
			interactive: palette.cobalt.light[3],
			interactiveHover: palette.cobalt.light[4],
			success: palette.apple.light[3],
			successStrong: palette.apple.light[9],
			warning: palette.solaris.light[3],
			warningStrong: palette.solaris.light[9],
			critical: palette.ember.light[3],
			criticalStrong: palette.ember.light[9],
			info: palette.lilac.light[3],
			infoStrong: palette.lilac.light[9],
		},
		text: {
			base: palette.smoke.light[11],
			weak: palette.smoke.light[9],
			weaker: palette.smoke.light[8],
			strong: palette.smoke.light[12],
			interactive: palette.cobalt.light[9],
			success: palette.apple.light[10],
			critical: palette.ember.light[10],
			warning: palette.smoke.darkAlpha[11],
		},
		border: {
			base: palette.smoke.lightAlpha[7],
			hover: palette.smoke.lightAlpha[8],
			active: palette.smoke.lightAlpha[9],
			weak: palette.smoke.lightAlpha[5],
			strong: palette.smoke.lightAlpha[7],
			selected: palette.cobalt.light[9],
			interactive: palette.cobalt.light[7],
			success: palette.apple.light[6],
			warning: palette.solaris.light[6],
			critical: palette.ember.light[6],
			info: palette.lilac.light[6],
		},
		icon: {
			base: palette.smoke.light[9],
			hover: palette.smoke.light[11],
			active: palette.smoke.light[12],
			weak: palette.smoke.light[7],
			strong: palette.smoke.light[12],
			interactive: palette.cobalt.light[9],
			success: palette.apple.light[7],
			warning: palette.solaris.light[7],
			critical: palette.ember.light[10],
			info: palette.lilac.light[7],
		},
		input: {
			base: palette.smoke.light[1],
			hover: palette.smoke.light[2],
			active: palette.cobalt.light[1],
			selected: palette.cobalt.light[4],
			disabled: palette.smoke.light[4],
		},
	},
	dark: {
		background: {
			base: palette.smoke.dark[1],
			weak: "#1c1717",
			strong: "#151313",
			stronger: "#191515",
		},
		surface: {
			base: palette.smoke.darkAlpha[2],
			hover: "#e0b7b716",
			active: palette.smoke.darkAlpha[3],
			weak: palette.smoke.darkAlpha[4],
			strong: palette.smoke.darkAlpha[7],
			brand: palette.yuzu.light[9],
			brandHover: palette.yuzu.light[10],
			interactive: palette.cobalt.light[3],
			interactiveHover: palette.cobalt.light[4],
			success: palette.apple.light[3],
			successStrong: palette.apple.light[9],
			warning: palette.solaris.light[3],
			warningStrong: palette.solaris.light[9],
			critical: palette.ember.dark[3],
			criticalStrong: palette.ember.dark[9],
			info: palette.lilac.light[3],
			infoStrong: palette.lilac.light[9],
		},
		text: {
			base: palette.smoke.darkAlpha[11],
			weak: palette.smoke.darkAlpha[9],
			weaker: palette.smoke.darkAlpha[8],
			strong: palette.smoke.darkAlpha[12],
			interactive: palette.cobalt.dark[11],
			success: palette.apple.dark[9],
			critical: palette.ember.dark[9],
			warning: palette.smoke.darkAlpha[11],
		},
		border: {
			base: palette.smoke.darkAlpha[7],
			hover: palette.smoke.darkAlpha[8],
			active: palette.smoke.darkAlpha[9],
			weak: palette.smoke.darkAlpha[6],
			strong: palette.smoke.darkAlpha[8],
			selected: palette.cobalt.dark[11],
			interactive: palette.cobalt.light[7],
			success: palette.apple.light[6],
			warning: palette.solaris.light[6],
			critical: palette.ember.dark[5],
			info: palette.lilac.light[6],
		},
		icon: {
			base: palette.smoke.dark[9],
			hover: palette.smoke.dark[10],
			active: palette.smoke.dark[11],
			weak: palette.smoke.dark[6],
			strong: palette.smoke.dark[12],
			interactive: palette.cobalt.dark[9],
			success: palette.apple.dark[7],
			warning: palette.solaris.dark[9],
			critical: palette.ember.dark[9],
			info: palette.lilac.dark[7],
		},
		input: {
			base: palette.smoke.dark[2],
			hover: palette.smoke.dark[2],
			active: palette.cobalt.dark[1],
			selected: palette.cobalt.dark[2],
			disabled: palette.smoke.dark[4],
		},
	},
} as const;

export type SemanticColors = {
	background: {
		base: string;
		weak: string;
		strong: string;
		stronger: string;
	};
	surface: {
		base: string;
		hover: string;
		active: string;
		weak: string;
		strong: string;
		brand: string;
		brandHover: string;
		interactive: string;
		interactiveHover: string;
		success: string;
		successStrong: string;
		warning: string;
		warningStrong: string;
		critical: string;
		criticalStrong: string;
		info: string;
		infoStrong: string;
	};
	text: {
		base: string;
		weak: string;
		weaker: string;
		strong: string;
		interactive: string;
		success: string;
		critical: string;
		warning: string;
	};
	border: {
		base: string;
		hover: string;
		active: string;
		weak: string;
		strong: string;
		selected: string;
		interactive: string;
		success: string;
		warning: string;
		critical: string;
		info: string;
	};
	icon: {
		base: string;
		hover: string;
		active: string;
		weak: string;
		strong: string;
		interactive: string;
		success: string;
		warning: string;
		critical: string;
		info: string;
	};
	input: {
		base: string;
		hover: string;
		active: string;
		selected: string;
		disabled: string;
	};
};

export const typography = {
	fontFamily: {
		sans: "Inter",
		mono: "IBM Plex Mono",
	},
	fontSize: {
		sm: 13,
		base: 14,
		lg: 16,
		xl: 20,
	},
	fontWeight: {
		regular: "400",
		medium: "500",
	},
	lineHeight: {
		normal: 1.5,
		relaxed: 1.8,
		loose: 2.0,
	},
	letterSpacing: {
		normal: 0,
		tight: -0.16,
		tighter: -0.32,
	},
} as const;

export const spacing = {
	unit: 4,
	0: 0,
	1: 4,
	2: 8,
	3: 12,
	4: 16,
	5: 20,
	6: 24,
	8: 32,
	10: 40,
	12: 48,
	16: 64,
} as const;

export const radii = {
	xs: 2,
	sm: 4,
	md: 6,
	lg: 8,
	xl: 10,
	full: 9999,
} as const;

export const shadows = {
	xs: {
		shadowColor: "#131010",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.08,
		shadowRadius: 3,
		elevation: 1,
	},
	md: {
		shadowColor: "#131010",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.12,
		shadowRadius: 8,
		elevation: 4,
	},
} as const;

export const breakpoints = {
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1280,
	"2xl": 1536,
} as const;
