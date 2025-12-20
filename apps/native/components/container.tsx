import type React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/lib/theme-context";

export function Container({ children }: { children: React.ReactNode }) {
	const { theme } = useTheme();

	return (
		<SafeAreaView
			style={[styles.container, { backgroundColor: theme.background.base }]}
		>
			{children}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
