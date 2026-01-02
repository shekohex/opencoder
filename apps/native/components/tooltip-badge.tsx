import type { ReactNode } from "react";
import { View } from "react-native";

export function TooltipBadge({
	label,
	children,
}: {
	label: string;
	children: ReactNode;
}) {
	return (
		<View accessibilityLabel={label} accessibilityHint={label}>
			{children}
		</View>
	);
}
