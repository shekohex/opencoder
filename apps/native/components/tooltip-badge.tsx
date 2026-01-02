import type { ReactNode } from "react";
import { Alert, Pressable } from "react-native";

export function TooltipBadge({
	label,
	children,
}: {
	label: string;
	children: ReactNode;
}) {
	return (
		<Pressable
			onPress={() => Alert.alert(label)}
			accessibilityRole="button"
			accessibilityLabel={label}
		>
			{children}
		</Pressable>
	);
}
