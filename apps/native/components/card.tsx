import type { ReactNode } from "react";
import type { ViewProps } from "react-native";
import { View } from "react-native";

export function Card({ className = "", ...props }: ViewProps) {
	return (
		<View
			className={`rounded-xl border border-border bg-surface ${className}`}
			{...props}
		/>
	);
}

export function CardHeader({ className = "", ...props }: ViewProps) {
	return <View className={`gap-1 ${className}`} {...props} />;
}

export function CardTitle({ children }: { children: ReactNode }) {
	return <View>{children}</View>;
}

export function CardContent({ className = "", ...props }: ViewProps) {
	return <View className={`gap-2 ${className}`} {...props} />;
}
