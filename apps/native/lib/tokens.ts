export const palette = {
	smoke: {
		dark: {
			1: "#0a0a0a",
			2: "#141414",
			3: "#1e1e1e",
			4: "#282828",
			5: "#323232",
			6: "#3c3c3c",
			7: "#484848",
			8: "#606060",
			9: "#fab283",
			10: "#ffc09f",
			11: "#808080",
			12: "#eeeeee",
		},
		light: {
			1: "#ffffff",
			2: "#fafafa",
			3: "#f5f5f5",
			4: "#ebebeb",
			5: "#e1e1e1",
			6: "#d4d4d4",
			7: "#b8b8b8",
			8: "#a0a0a0",
			9: "#3b7dd8",
			10: "#2968c3",
			11: "#8a8a8a",
			12: "#1a1a1a",
		},
		darkAlpha: {
			1: "#00000003",
			2: "#ffffff0b",
			3: "#ffffff16",
			4: "#ffffff1e",
			5: "#ffffff26",
			6: "#ffffff31",
			7: "#ffffff3f",
			8: "#ffffff59",
			9: "#ffffff67",
			10: "#ffffff76",
			11: "#ffffffb2",
			12: "#fffffff0",
		},
		lightAlpha: {
			1: "#00000003",
			2: "#00000007",
			3: "#0000000f",
			4: "#00000017",
			5: "#0000001f",
			6: "#00000026",
			7: "#00000032",
			8: "#00000044",
			9: "#00000074",
			10: "#0000009c",
			11: "#0000007e",
			12: "#000000df",
		},
	},
	opencode: {
		dark: {
			secondary: "#5c9cf5",
			accent: "#9d7cd8",
			red: "#e06c75",
			orange: "#f5a742",
			green: "#7fd88f",
			cyan: "#56b6c2",
			yellow: "#e5c07b",
		},
		light: {
			secondary: "#7b5bb6",
			accent: "#d68c27",
			red: "#d1383d",
			orange: "#d68c27",
			green: "#3d9a57",
			cyan: "#318795",
			yellow: "#b0851f",
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
			base: palette.smoke.light[1],
			weak: palette.smoke.light[3],
			strong: palette.smoke.light[1],
			stronger: palette.smoke.light[2],
		},
		surface: {
			base: palette.smoke.lightAlpha[2],
			hover: palette.smoke.lightAlpha[3],
			active: palette.smoke.lightAlpha[4],
			weak: palette.smoke.lightAlpha[3],
			strong: palette.smoke.light[1],
			brand: palette.smoke.light[9],
			brandHover: palette.smoke.light[10],
			interactive: "#3b7dd820",
			interactiveHover: "#3b7dd830",
			success: "#3d9a5720",
			successStrong: palette.opencode.light.green,
			warning: "#d68c2720",
			warningStrong: palette.opencode.light.orange,
			critical: "#d1383d20",
			criticalStrong: palette.opencode.light.red,
			info: "#31879520",
			infoStrong: palette.opencode.light.cyan,
		},
		text: {
			base: palette.smoke.light[11],
			weak: palette.smoke.light[11],
			weaker: palette.smoke.light[8],
			strong: palette.smoke.light[12],
			interactive: palette.smoke.light[9],
			success: palette.opencode.light.green,
			critical: palette.opencode.light.red,
			warning: palette.opencode.light.orange,
		},
		border: {
			base: palette.smoke.lightAlpha[7],
			hover: palette.smoke.lightAlpha[8],
			active: palette.smoke.lightAlpha[9],
			weak: palette.smoke.lightAlpha[5],
			strong: palette.smoke.light[7],
			selected: palette.smoke.light[9],
			interactive: palette.smoke.light[9],
			success: "#3d9a5780",
			warning: "#d68c2780",
			critical: "#d1383d80",
			info: "#31879580",
		},
		icon: {
			base: palette.smoke.light[11],
			hover: palette.smoke.light[12],
			active: palette.smoke.light[12],
			weak: palette.smoke.light[8],
			strong: palette.smoke.light[12],
			interactive: palette.smoke.light[9],
			success: palette.opencode.light.green,
			warning: palette.opencode.light.orange,
			critical: palette.opencode.light.red,
			info: palette.opencode.light.cyan,
		},
		input: {
			base: palette.smoke.light[1],
			hover: palette.smoke.light[2],
			active: palette.smoke.light[3],
			selected: "#3b7dd820",
			disabled: palette.smoke.light[4],
		},
	},
	dark: {
		background: {
			base: palette.smoke.dark[1],
			weak: palette.smoke.dark[2],
			strong: palette.smoke.dark[1],
			stronger: palette.smoke.dark[2],
		},
		surface: {
			base: palette.smoke.darkAlpha[2],
			hover: palette.smoke.darkAlpha[3],
			active: palette.smoke.darkAlpha[4],
			weak: palette.smoke.darkAlpha[3],
			strong: palette.smoke.darkAlpha[7],
			brand: palette.smoke.dark[9],
			brandHover: palette.smoke.dark[10],
			interactive: "#5c9cf530",
			interactiveHover: "#5c9cf540",
			success: "#7fd88f20",
			successStrong: palette.opencode.dark.green,
			warning: "#f5a74220",
			warningStrong: palette.opencode.dark.orange,
			critical: "#e06c7520",
			criticalStrong: palette.opencode.dark.red,
			info: "#56b6c220",
			infoStrong: palette.opencode.dark.cyan,
		},
		text: {
			base: palette.smoke.dark[12],
			weak: palette.smoke.dark[11],
			weaker: palette.smoke.dark[8],
			strong: palette.smoke.dark[12],
			interactive: palette.opencode.dark.secondary,
			success: palette.opencode.dark.green,
			critical: palette.opencode.dark.red,
			warning: palette.opencode.dark.orange,
		},
		border: {
			base: palette.smoke.darkAlpha[7],
			hover: palette.smoke.darkAlpha[8],
			active: palette.smoke.darkAlpha[9],
			weak: palette.smoke.darkAlpha[6],
			strong: palette.smoke.dark[7],
			selected: palette.opencode.dark.secondary,
			interactive: palette.opencode.dark.secondary,
			success: "#7fd88f80",
			warning: "#f5a74280",
			critical: "#e06c7580",
			info: "#56b6c280",
		},
		icon: {
			base: palette.smoke.dark[11],
			hover: palette.smoke.dark[12],
			active: palette.smoke.dark[12],
			weak: palette.smoke.dark[8],
			strong: palette.smoke.dark[12],
			interactive: palette.opencode.dark.secondary,
			success: palette.opencode.dark.green,
			warning: palette.opencode.dark.orange,
			critical: palette.opencode.dark.red,
			info: palette.opencode.dark.cyan,
		},
		input: {
			base: palette.smoke.dark[2],
			hover: palette.smoke.dark[3],
			active: palette.smoke.dark[3],
			selected: "#5c9cf530",
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
