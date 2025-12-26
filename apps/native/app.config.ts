import type { ExpoConfig } from "@expo/config-types";

const config: ExpoConfig = {
	name: "OpenCoder",
	slug: "opencoder",
	version: "1.0.0",
	orientation: "portrait",
	icon: "./assets/images/opencoder-icon-light.png",

	scheme: "opencoder",
	userInterfaceStyle: "automatic",
	newArchEnabled: true,
	ios: {
		supportsTablet: true,
		bundleIdentifier: "com.github.shekohex.opencoder",
		icon: "./assets/images/opencoder-icon-light.png",
	},
	android: {
		adaptiveIcon: {
			backgroundColor: "#FFFFFF",
			foregroundImage: "./assets/images/android-icon-foreground.png",
			backgroundImage: "./assets/images/android-icon-background.png",
			monochromeImage: "./assets/images/android-icon-monochrome.png",
		},
		edgeToEdgeEnabled: true,
		predictiveBackGestureEnabled: false,
		package: "com.github.shekohex.opencoder",
	},
	web: {
		output: "server",
		favicon: "./assets/images/favicon.png",
	},
	plugins: [
		"expo-router",
		[
			"expo-splash-screen",
			{
				image: "./assets/images/opencoder-logo-light.png",
				imageWidth: 250,
				resizeMode: "contain",
				backgroundColor: "#ffffff",
				dark: {
					image: "./assets/images/opencoder-logo-dark.png",
					backgroundColor: "#000000",
				},
			},
		],
		"expo-secure-store",
		[
			"expo-font",
			{
				fonts: [
					"node_modules/@expo-google-fonts/inter/300Light/Inter_300Light.ttf",
					"node_modules/@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf",
					"node_modules/@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf",
					"node_modules/@expo-google-fonts/manrope/300Light/Manrope_300Light.ttf",
					"node_modules/@expo-google-fonts/manrope/400Regular/Manrope_400Regular.ttf",
					"node_modules/@expo-google-fonts/manrope/700Bold/Manrope_700Bold.ttf",
					"node_modules/@expo-google-fonts/ibm-plex-mono/300Light/IBMPlexMono_300Light.ttf",
					"node_modules/@expo-google-fonts/ibm-plex-mono/400Regular/IBMPlexMono_400Regular.ttf",
					"node_modules/@expo-google-fonts/ibm-plex-mono/700Bold/IBMPlexMono_700Bold.ttf",
					"node_modules/@expo-google-fonts/jetbrains-mono/300Light/JetBrainsMono_300Light.ttf",
					"node_modules/@expo-google-fonts/jetbrains-mono/400Regular/JetBrainsMono_400Regular.ttf",
					"node_modules/@expo-google-fonts/jetbrains-mono/700Bold/JetBrainsMono_700Bold.ttf",
					"node_modules/@expo-google-fonts/turret-road/800ExtraBold/TurretRoad_800ExtraBold.ttf",
					"./assets/fonts/nerd-fonts/BlexMonoNerdFont-Light.ttf",
					"./assets/fonts/nerd-fonts/BlexMonoNerdFont-Regular.ttf",
					"./assets/fonts/nerd-fonts/BlexMonoNerdFont-Bold.ttf",
					"./assets/fonts/nerd-fonts/JetBrainsMonoNerdFont-Light.ttf",
					"./assets/fonts/nerd-fonts/JetBrainsMonoNerdFont-Regular.ttf",
					"./assets/fonts/nerd-fonts/JetBrainsMonoNerdFont-Bold.ttf",
				],
				android: {
					fonts: [
						{
							fontFamily: "Inter",
							fontDefinitions: [
								{
									path: "node_modules/@expo-google-fonts/inter/300Light/Inter_300Light.ttf",
									weight: 300,
								},
								{
									path: "node_modules/@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf",
									weight: 400,
								},
								{
									path: "node_modules/@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf",
									weight: 700,
								},
							],
						},
						{
							fontFamily: "Manrope",
							fontDefinitions: [
								{
									path: "node_modules/@expo-google-fonts/manrope/300Light/Manrope_300Light.ttf",
									weight: 300,
								},
								{
									path: "node_modules/@expo-google-fonts/manrope/400Regular/Manrope_400Regular.ttf",
									weight: 400,
								},
								{
									path: "node_modules/@expo-google-fonts/manrope/700Bold/Manrope_700Bold.ttf",
									weight: 700,
								},
							],
						},
						{
							fontFamily: "IBMPlexMono",
							fontDefinitions: [
								{
									path: "node_modules/@expo-google-fonts/ibm-plex-mono/300Light/IBMPlexMono_300Light.ttf",
									weight: 300,
								},
								{
									path: "node_modules/@expo-google-fonts/ibm-plex-mono/400Regular/IBMPlexMono_400Regular.ttf",
									weight: 400,
								},
								{
									path: "node_modules/@expo-google-fonts/ibm-plex-mono/700Bold/IBMPlexMono_700Bold.ttf",
									weight: 700,
								},
							],
						},
						{
							fontFamily: "JetBrainsMono",
							fontDefinitions: [
								{
									path: "node_modules/@expo-google-fonts/jetbrains-mono/300Light/JetBrainsMono_300Light.ttf",
									weight: 300,
								},
								{
									path: "node_modules/@expo-google-fonts/jetbrains-mono/400Regular/JetBrainsMono_400Regular.ttf",
									weight: 400,
								},
								{
									path: "node_modules/@expo-google-fonts/jetbrains-mono/700Bold/JetBrainsMono_700Bold.ttf",
									weight: 700,
								},
							],
						},
						{
							fontFamily: "BlexMonoNerdFont",
							fontDefinitions: [
								{
									path: "./assets/fonts/nerd-fonts/BlexMonoNerdFont-Light.ttf",
									weight: 300,
								},
								{
									path: "./assets/fonts/nerd-fonts/BlexMonoNerdFont-Regular.ttf",
									weight: 400,
								},
								{
									path: "./assets/fonts/nerd-fonts/BlexMonoNerdFont-Bold.ttf",
									weight: 700,
								},
							],
						},
						{
							fontFamily: "TurretRoad",
							fontDefinitions: [
								{
									path: "node_modules/@expo-google-fonts/turret-road/800ExtraBold/TurretRoad_800ExtraBold.ttf",
									weight: 800,
								},
							],
						},
						{
							fontFamily: "JetBrainsMonoNerdFont",
							fontDefinitions: [
								{
									path: "./assets/fonts/nerd-fonts/JetBrainsMonoNerdFont-Light.ttf",
									weight: 300,
								},
								{
									path: "./assets/fonts/nerd-fonts/JetBrainsMonoNerdFont-Regular.ttf",
									weight: 400,
								},
								{
									path: "./assets/fonts/nerd-fonts/JetBrainsMonoNerdFont-Bold.ttf",
									weight: 700,
								},
							],
						},
					],
				},
				ios: {
					fonts: [
						"node_modules/@expo-google-fonts/inter/300Light/Inter_300Light.ttf",
						"node_modules/@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf",
						"node_modules/@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf",
						"node_modules/@expo-google-fonts/manrope/300Light/Manrope_300Light.ttf",
						"node_modules/@expo-google-fonts/manrope/400Regular/Manrope_400Regular.ttf",
						"node_modules/@expo-google-fonts/manrope/700Bold/Manrope_700Bold.ttf",
						"node_modules/@expo-google-fonts/ibm-plex-mono/300Light/IBMPlexMono_300Light.ttf",
						"node_modules/@expo-google-fonts/ibm-plex-mono/400Regular/IBMPlexMono_400Regular.ttf",
						"node_modules/@expo-google-fonts/ibm-plex-mono/700Bold/IBMPlexMono_700Bold.ttf",
						"node_modules/@expo-google-fonts/jetbrains-mono/300Light/JetBrainsMono_300Light.ttf",
						"node_modules/@expo-google-fonts/jetbrains-mono/400Regular/JetBrainsMono_400Regular.ttf",
						"node_modules/@expo-google-fonts/jetbrains-mono/700Bold/JetBrainsMono_700Bold.ttf",
						"node_modules/@expo-google-fonts/turret-road/800ExtraBold/TurretRoad_800ExtraBold.ttf",
						"./assets/fonts/nerd-fonts/BlexMonoNerdFont-Light.ttf",
						"./assets/fonts/nerd-fonts/BlexMonoNerdFont-Regular.ttf",
						"./assets/fonts/nerd-fonts/BlexMonoNerdFont-Bold.ttf",
						"./assets/fonts/nerd-fonts/JetBrainsMonoNerdFont-Light.ttf",
						"./assets/fonts/nerd-fonts/JetBrainsMonoNerdFont-Regular.ttf",
						"./assets/fonts/nerd-fonts/JetBrainsMonoNerdFont-Bold.ttf",
					],
				},
			},
		],
		[
			"expo-web-browser",
			{
				experimentalLauncherActivity: true,
			},
		],
	],
	experiments: {
		typedRoutes: true,
		reactCompiler: true,
	},
};

export default config;
