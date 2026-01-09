import { View } from "react-native";

import { AppText } from "@/components/app-text";

export interface ProjectSectionHeaderProps {
	title: string;
	variant?: "sidebar" | "page";
}

export function ProjectSectionHeader({
	title,
	variant = "sidebar",
}: ProjectSectionHeaderProps) {
	if (variant === "page") {
		return (
			<View className="pt-6 pb-3">
				<AppText className="font-medium text-foreground-weak text-sm uppercase tracking-wide">
					{title}
				</AppText>
			</View>
		);
	}

	return (
		<AppText className="text-foreground-weak text-xs uppercase">
			{title}
		</AppText>
	);
}
