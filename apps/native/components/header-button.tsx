import FontAwesome from "@expo/vector-icons/FontAwesome";
import { forwardRef } from "react";
import { Pressable, StyleSheet, type View } from "react-native";
import { useTheme } from "@/lib/theme-context";

export const HeaderButton = forwardRef<View, { onPress?: () => void }>(
	({ onPress }, ref) => {
		const { theme } = useTheme();

		return (
			<Pressable
				ref={ref}
				onPress={onPress}
				style={({ pressed }) => [
					styles.button,
					{
						backgroundColor: pressed
							? theme.background.base
							: theme.background.stronger,
					},
				]}
			>
				{({ pressed }) => (
					<FontAwesome
						name="info-circle"
						size={20}
						color={theme.text.strong}
						style={{
							opacity: pressed ? 0.7 : 1,
						}}
					/>
				)}
			</Pressable>
		);
	},
);

const styles = StyleSheet.create({
	button: {
		padding: 8,
		marginRight: 8,
	},
});
