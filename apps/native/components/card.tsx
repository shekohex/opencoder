import type { ReactNode } from "react";
import type { ViewProps } from "react-native";
import { View } from "react-native";

export function Card({ className = "", ...props }: ViewProps) {
	return (
		<View
			className={`neo-shadow-md hover:neo-shadow-lg rounded-none border-4 border-black bg-white transition-all duration-200 hover:-translate-y-2 ${className}`}
			{...props}
		/>
	);
}

export function CardHeader({ className = "", ...props }: ViewProps) {
	return (
		<View
			className={`border-black border-b-4 bg-surface-muted/20 ${className}`}
			{...props}
		/>
	);
}

export function CardTitle({ children }: { children: ReactNode }) {
	return <View>{children}</View>;
}

export function CardContent({ className = "", ...props }: ViewProps) {
	return <View className={`gap-2 ${className}`} {...props} />;
}
