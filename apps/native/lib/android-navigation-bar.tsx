import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";

export async function setAndroidNavigationBar(
	mode: "light" | "dark",
	backgroundColor: string,
) {
	if (Platform.OS !== "android") return;
	await NavigationBar.setButtonStyleAsync(mode === "dark" ? "light" : "dark");
	try {
		await NavigationBar.setBackgroundColorAsync(backgroundColor);
	} catch (_e) {
		// Ignore edge-to-edge warning
	}
}
