import "../global.css";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { OverlayProvider } from "@react-native-aria/overlays";
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider as NavigationThemeProvider,
	type Theme,
} from "@react-navigation/native";
import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
import { Platform, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { setAndroidNavigationBar } from "@/lib/android-navigation-bar";
import { SessionProvider, useSession } from "@/lib/auth";
import { FontProvider } from "@/lib/font-context";
import { getWebFontMap } from "@/lib/font-registry";
import { HotkeysProvider } from "@/lib/hotkeys";
import { NuqsAdapter } from "@/lib/nuqs-adapter";
import { createQueryClient } from "@/lib/query-client";
import { ThemeProvider, useTheme } from "@/lib/theme-context";

export const unstable_settings = {
	initialRouteName: "(app)",
};

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
	const { mode, theme, themeName } = useTheme();
	const [isThemeLoaded, setIsThemeLoaded] = React.useState(false);
	const { isLoading } = useSession();
	const [fontsLoaded] = useFonts(Platform.OS === "web" ? getWebFontMap() : {});

	const navTheme: Theme = React.useMemo(
		() => ({
			...(mode === "dark" ? DarkTheme : DefaultTheme),
			colors: theme.navTheme,
		}),
		[mode, theme.navTheme],
	);

	useIsomorphicLayoutEffect(() => {
		if (!hasMounted.current) {
			setIsThemeLoaded(true);
			hasMounted.current = true;
		}
		setAndroidNavigationBar(mode, theme.background.base);
	}, [mode, themeName, theme.background.base]);

	useEffect(() => {
		if (isThemeLoaded && !isLoading && (Platform.OS !== "web" || fontsLoaded)) {
			SplashScreen.hideAsync();
		}
	}, [isThemeLoaded, isLoading, fontsLoaded]);

	if (!isThemeLoaded || isLoading || (Platform.OS === "web" && !fontsLoaded)) {
		return null;
	}

	return (
		<NavigationThemeProvider value={navTheme}>
			<StatusBar style={mode === "dark" ? "light" : "dark"} />
			<GestureHandlerRootView style={styles.container}>
				<ActionSheetProvider>
					<BottomSheetModalProvider>
						<OverlayProvider>
							<Stack>
								<Stack.Screen name="(app)" options={{ headerShown: false }} />
								<Stack.Screen name="sign-in" options={{ headerShown: false }} />
								<Stack.Screen
									name="modal"
									options={{ title: "Modal", presentation: "modal" }}
								/>
								<Stack.Screen name="+not-found" />
							</Stack>
						</OverlayProvider>
					</BottomSheetModalProvider>
				</ActionSheetProvider>
			</GestureHandlerRootView>
		</NavigationThemeProvider>
	);
}

export default function RootLayout() {
	const queryClientRef = useRef<QueryClient | null>(null);

	if (!queryClientRef.current) {
		queryClientRef.current = createQueryClient();
	}

	return (
		<QueryClientProvider client={queryClientRef.current}>
			{Platform.OS === "web" && __DEV__ ? (
				<ReactQueryDevtools initialIsOpen={false} />
			) : null}
			<SessionProvider queryClient={queryClientRef.current}>
				<FontProvider>
					<NuqsAdapter>
						<ThemeProvider>
							<HotkeysProvider>
								<RootLayoutContent />
							</HotkeysProvider>
						</ThemeProvider>
					</NuqsAdapter>
				</FontProvider>
			</SessionProvider>
		</QueryClientProvider>
	);
}
