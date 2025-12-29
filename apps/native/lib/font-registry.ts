import {
	IBMPlexMono_300Light,
	IBMPlexMono_400Regular,
	IBMPlexMono_700Bold,
} from "@expo-google-fonts/ibm-plex-mono";

// Import Google Fonts for Web loading
// These imports return the required module (number or URI) that expo-font can consume.
import {
	Inter_300Light,
	Inter_400Regular,
	Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
	JetBrainsMono_300Light,
	JetBrainsMono_400Regular,
	JetBrainsMono_700Bold,
} from "@expo-google-fonts/jetbrains-mono";
import {
	Manrope_300Light,
	Manrope_400Regular,
	Manrope_700Bold,
} from "@expo-google-fonts/manrope";
import { TurretRoad_800ExtraBold } from "@expo-google-fonts/turret-road";
import { Platform } from "react-native";

// --- Types ---

export type FontRole = "sans" | "mono";
export type FontWeight = 300 | 400 | 700 | 800;
export type MonoFlavor = "normal" | "nerd";

// We allow specific subsets for Sans/Mono to be passed in options,
// matching what we have in the epic description.
export type SansFamily = "Inter" | "Manrope" | "Turret Road";
export type MonoFamily = "IBMPlexMono" | "JetBrainsMono";

export interface FontRegistryOptions {
	role: FontRole;
	weight?: FontWeight;
	// If role is sans, family can be a SansFamily.
	// If role is mono, family can be a MonoFamily.
	// Defaults will be handled by the consumer or here.
	family?: string;
	flavor?: MonoFlavor;
}

// --- Android Families (Defined in app.json) ---
const ANDROID_FAMILIES = {
	Inter: "Inter",
	Manrope: "Manrope",
	"Turret Road": "TurretRoad",
	IBMPlexMono: "IBMPlexMono",
	JetBrainsMono: "JetBrainsMono",
	BlexMonoNerdFont: "BlexMonoNerdFont",
	JetBrainsMonoNerdFont: "JetBrainsMonoNerdFont",
};

// --- iOS PostScript Names (Assumed based on file contents/standard) ---
const IOS_FAMILIES = {
	Inter: {
		300: "Inter-Light",
		400: "Inter-Regular",
		700: "Inter-Bold",
	},
	Manrope: {
		300: "Manrope-Light",
		400: "Manrope-Regular",
		700: "Manrope-Bold",
	},
	"Turret Road": {
		800: "TurretRoad-ExtraBold",
	},
	IBMPlexMono: {
		300: "IBMPlexMono-Light",
		400: "IBMPlexMono-Regular",
		700: "IBMPlexMono-Bold",
	},
	JetBrainsMono: {
		300: "JetBrainsMono-Light",
		400: "JetBrainsMono-Regular",
		700: "JetBrainsMono-Bold",
	},
	BlexMonoNerdFont: {
		300: "BlexMonoNF-Light",
		400: "BlexMonoNF",
		700: "BlexMonoNF-Bold",
	},
	JetBrainsMonoNerdFont: {
		300: "JetBrainsMonoNF-Light",
		400: "JetBrainsMonoNF-Regular",
		700: "JetBrainsMonoNF-Bold",
	},
};

// --- Web Font Names (Matches @expo-google-fonts exports + Custom Nerd naming) ---
const WEB_FAMILIES = {
	Inter: {
		300: "Inter_300Light",
		400: "Inter_400Regular",
		700: "Inter_700Bold",
	},
	Manrope: {
		300: "Manrope_300Light",
		400: "Manrope_400Regular",
		700: "Manrope_700Bold",
	},
	"Turret Road": {
		800: "TurretRoad_800ExtraBold",
	},
	IBMPlexMono: {
		300: "IBMPlexMono_300Light",
		400: "IBMPlexMono_400Regular",
		700: "IBMPlexMono_700Bold",
	},
	JetBrainsMono: {
		300: "JetBrainsMono_300Light",
		400: "JetBrainsMono_400Regular",
		700: "JetBrainsMono_700Bold",
	},
	BlexMonoNerdFont: {
		300: "BlexMonoNerdFont_300Light",
		400: "BlexMonoNerdFont_400Regular",
		700: "BlexMonoNerdFont_700Bold",
	},
	JetBrainsMonoNerdFont: {
		300: "JetBrainsMonoNerdFont_300Light",
		400: "JetBrainsMonoNerdFont_400Regular",
		700: "JetBrainsMonoNerdFont_700Bold",
	},
};

// --- Resolver ---

export function getFontFamily(options: FontRegistryOptions): string {
	const { role, weight = 400, flavor = "normal" } = options;
	let family = options.family;

	// Defaults
	if (!family) {
		family = role === "sans" ? "Inter" : "IBMPlexMono";
	}

	// Handle Nerd Flavor for Mono
	if (role === "mono" && flavor === "nerd") {
		if (family === "IBMPlexMono") family = "BlexMonoNerdFont";
		if (family === "JetBrainsMono") family = "JetBrainsMonoNerdFont";
	}

	// Normalize family name key (just in case)
	const familyKey = family as keyof typeof ANDROID_FAMILIES;

	if (Platform.OS === "android") {
		// Android uses the mapped family name from app.json
		// The View component handles the weight property.
		return ANDROID_FAMILIES[familyKey] || family;
	}

	if (Platform.OS === "ios") {
		// iOS uses explicit PostScript names for embedded fonts to ensure correct weight loading
		const mapping = (IOS_FAMILIES as Record<string, Record<number, string>>)[
			familyKey
		];
		if (mapping) {
			return mapping[weight] || mapping[400] || family;
		}
		return family;
	}

	// Web
	const mapping = (WEB_FAMILIES as Record<string, Record<number, string>>)[
		familyKey
	];
	if (mapping) {
		return mapping[weight] || mapping[400] || family;
	}
	return family;
}

// --- Web Font Map Helper ---

/**
 * Returns the map of fonts to load via expo-font useFonts on Web.
 * This includes the Google Fonts and the local Nerd Fonts.
 *
 * IMPORTANT: The @expo-google-fonts imports must be done at the top level of the entry file
 * or wherever useFonts is called.
 */
export function getWebFontMap() {
	return {
		// Inter
		Inter_300Light,
		Inter_400Regular,
		Inter_700Bold,
		// Manrope
		Manrope_300Light,
		Manrope_400Regular,
		Manrope_700Bold,
		// Turret Road
		TurretRoad_800ExtraBold,
		// IBM Plex Mono
		IBMPlexMono_300Light,
		IBMPlexMono_400Regular,
		IBMPlexMono_700Bold,
		// JetBrains Mono
		JetBrainsMono_300Light,
		JetBrainsMono_400Regular,
		JetBrainsMono_700Bold,
		// Nerd Fonts (Local Assets)
		BlexMonoNerdFont_300Light: require("../assets/fonts/nerd-fonts/BlexMonoNerdFont-Light.ttf"),
		BlexMonoNerdFont_400Regular: require("../assets/fonts/nerd-fonts/BlexMonoNerdFont-Regular.ttf"),
		BlexMonoNerdFont_700Bold: require("../assets/fonts/nerd-fonts/BlexMonoNerdFont-Bold.ttf"),
		JetBrainsMonoNerdFont_300Light: require("../assets/fonts/nerd-fonts/JetBrainsMonoNerdFont-Light.ttf"),
		JetBrainsMonoNerdFont_400Regular: require("../assets/fonts/nerd-fonts/JetBrainsMonoNerdFont-Regular.ttf"),
		JetBrainsMonoNerdFont_700Bold: require("../assets/fonts/nerd-fonts/JetBrainsMonoNerdFont-Bold.ttf"),
	};
}
