import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Pressable, View } from "react-native";
import { AppText } from "@/components/app-text";

export function SessionsSidebar({
	collapsed = true,
	projectName,
	onTogglePress,
	onNewSessionPress,
	children,
}: {
	collapsed?: boolean;
	projectName?: string;
	onTogglePress?: () => void;
	onNewSessionPress?: () => void;
	children?: ReactNode;
}) {
	if (collapsed) {
		return null;
	}

	return (
		<View className="h-full flex-1 border-border border-r bg-background">
			<View className="flex-row items-center justify-between border-border border-b px-3 py-3">
				<AppText
					className="flex-1 font-semibold text-foreground-strong text-sm"
					numberOfLines={1}
				>
					{projectName ?? "Sessions"}
				</AppText>
				<Pressable
					onPress={onTogglePress}
					className="h-7 w-7 items-center justify-center rounded-lg"
					accessibilityRole="button"
					accessibilityLabel="Close sessions panel"
				>
					<Ionicons name="close" size={16} color="var(--color-icon)" />
				</Pressable>
			</View>
			<View className="flex-1 overflow-hidden">{children}</View>
			<View className="border-border border-t px-3 py-3">
				<Pressable
					onPress={onNewSessionPress}
					className="flex-row items-center justify-center gap-2 rounded-lg bg-surface-interactive px-3 py-2"
					accessibilityRole="button"
					accessibilityLabel="Create new session"
				>
					<Ionicons name="add" size={18} color="var(--color-icon)" />
					<AppText className="font-medium text-foreground text-sm">
						New Session
					</AppText>
				</Pressable>
			</View>
		</View>
	);
}
