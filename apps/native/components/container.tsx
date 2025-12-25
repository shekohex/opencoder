import type React from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/lib/theme-context";

export function Container({
	children,
	style,
}: {
	children: React.ReactNode;
	style?: StyleProp<ViewStyle>;
}) {
	const { theme } = useTheme();

	return (
		<SafeAreaView
			style={[
				styles.container,
				{ backgroundColor: theme.background.base },
				style,
			]}
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
