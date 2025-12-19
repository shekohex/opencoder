import "../global.css";
import {
	DarkTheme,
	DefaultTheme,
	type Theme,
	ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
import { Platform, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { setAndroidNavigationBar } from "@/lib/android-navigation-bar";
import { SessionProvider, useSession } from "@/lib/auth";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

const LIGHT_THEME: Theme = {
	...DefaultTheme,
	colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
	...DarkTheme,
	colors: NAV_THEME.dark,
};

export const unstable_settings = {
	initialRouteName: "(app)",
};

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const useIsomorphicLayoutEffect =
	Platform.OS === "web" && typeof window === "undefined"
		? React.useEffect
		: React.useLayoutEffect;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

function RootLayoutContent() {
	const hasMounted = useRef(false);
	const { colorScheme, isDarkColorScheme } = useColorScheme();
	const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
	const { isLoading } = useSession();

	useIsomorphicLayoutEffect(() => {
		if (hasMounted.current) {
			return;
		}
		setAndroidNavigationBar(colorScheme);
		setIsColorSchemeLoaded(true);
		hasMounted.current = true;
	}, []);

	useEffect(() => {
		if (isColorSchemeLoaded && !isLoading) {
			SplashScreen.hideAsync();
		}
	}, [isColorSchemeLoaded, isLoading]);

	if (!isColorSchemeLoaded || isLoading) {
		return null;
	}

	return (
		<ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
			<StatusBar style={isDarkColorScheme ? "light" : "dark"} />
			<GestureHandlerRootView style={styles.container}>
				<Stack>
					<Stack.Screen name="(app)" options={{ headerShown: false }} />
					<Stack.Screen name="sign-in" options={{ headerShown: false }} />
					<Stack.Screen
						name="modal"
						options={{ title: "Modal", presentation: "modal" }}
					/>
					<Stack.Screen name="+not-found" />
				</Stack>
			</GestureHandlerRootView>
		</ThemeProvider>
	);
}

export default function RootLayout() {
	return (
		<SessionProvider>
			<RootLayoutContent />
		</SessionProvider>
	);
}
