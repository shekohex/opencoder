import type { ViewProps } from "react-native";
import { View } from "react-native";
import { AppText } from "./app-text";

export interface BadgeProps extends ViewProps {
	variant?: "accent" | "secondary" | "muted";
	children: string;
	rotation?: number;
}

export function Badge({
	variant = "accent",
	children,
	rotation = 0,
	className = "",
	...props
}: BadgeProps) {
	const variantStyles = {
		accent: "bg-surface-brand text-white",
		secondary: "bg-surface-warningStrong text-black",
		muted: "bg-surface-infoStrong text-black",
	};

	const rotateStyle =
		rotation !== 0 ? { transform: [{ rotate: `${rotation}deg` }] } : {};

	return (
		<View
			className={`neo-shadow-sm rounded-full border-4 border-black px-4 py-2 ${variantStyles[variant]} ${className}`}
			style={rotateStyle}
			{...props}
		>
			<AppText className="text-center font-black text-sm uppercase tracking-widest">
				{children}
			</AppText>
		</View>
	);
}
