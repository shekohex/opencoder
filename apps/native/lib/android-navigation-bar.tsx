import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";
import { NAV_THEME } from "@/lib/constants";

export async function setAndroidNavigationBar(theme: "light" | "dark") {
	if (Platform.OS !== "android") return;
	await NavigationBar.setButtonStyleAsync(theme === "dark" ? "light" : "dark");
	// Edge-to-edge support: setting background color is not supported/needed when edge-to-edge is enabled.
	// We might need to make this conditional or remove it if edge-to-edge is the default.
	// For now, wrapping in try-catch to suppress the warning or check if we can detect edge-to-edge.
	// Since we are likely using edge-to-edge, we should probably set it to transparent or skip.
	try {
		await NavigationBar.setBackgroundColorAsync(
			theme === "dark" ? NAV_THEME.dark.background : NAV_THEME.light.background,
		);
	} catch (_e) {
		// Ignore edge-to-edge warning
	}
}
