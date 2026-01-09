import type { Href } from "expo-router";
import { Link } from "expo-router";
import { Pressable, View } from "react-native";

import { AppText } from "@/components/app-text";

export interface ProjectRowProps {
	name: string;
	status: string;
	lastUsed: string;
	height: number;
	isSelected?: boolean;
	onPress?: () => void;
	variant?: "sidebar" | "page";
	href?: Href;
}

export function ProjectRow({
	name,
	status,
	lastUsed,
	height,
	isSelected,
	onPress,
	variant = "sidebar",
	href,
}: ProjectRowProps) {
	const isSidebar = variant === "sidebar";

	const selectedClassName = isSidebar
		? "bg-surface"
		: "border-border-info bg-surface-info";

	const unselectedClassName = isSidebar
		? "bg-transparent"
		: "border-border bg-surface";

	const baseClassName = isSidebar
		? "focus-ring justify-center rounded-xl px-3"
		: "focus-ring rounded-xl border px-3";

	const content = (
		<Pressable
			onPress={onPress}
			className={`${baseClassName} ${isSelected ? selectedClassName : unselectedClassName}`}
			style={{ height }}
			accessibilityRole="button"
			accessibilityLabel={`${name} project`}
		>
			<View className="flex-row items-center justify-between">
				<AppText
					className={`text-foreground-strong text-sm ${isSidebar ? "" : "font-medium"}`}
				>
					{name}
				</AppText>
				<AppText className="text-foreground-weak text-xs">{status}</AppText>
			</View>
			<AppText className="text-foreground-weak text-xs">
				Updated {lastUsed}
			</AppText>
		</Pressable>
	);

	if (href) {
		return (
			<Link href={href} asChild>
				{content}
			</Link>
		);
	}

	return content;
}
