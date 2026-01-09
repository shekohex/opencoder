import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { AppText } from "@/components/app-text";

export function SidebarFooter({
	collapsed = false,
	onSettingsPress,
	onTogglePress,
}: {
	collapsed?: boolean;
	onSettingsPress?: () => void;
	onTogglePress?: () => void;
}) {
	if (collapsed) {
		return (
			<View className="items-center gap-2 border-border border-t py-3">
				<Pressable
					onPress={onSettingsPress}
					className="h-10 w-10 items-center justify-center rounded-lg"
					accessibilityRole="button"
					accessibilityLabel="Settings"
				>
					<Ionicons
						name="settings-outline"
						size={20}
						color="var(--color-icon)"
					/>
				</Pressable>
				<Pressable
					onPress={onTogglePress}
					className="h-10 w-10 items-center justify-center rounded-lg"
					accessibilityRole="button"
					accessibilityLabel="Expand sidebar"
				>
					<Ionicons
						name="chevron-forward"
						size={20}
						color="var(--color-icon)"
					/>
				</Pressable>
			</View>
		);
	}

	return (
		<View className="flex-row items-center justify-between border-border border-t px-3 py-3">
			<Pressable
				onPress={onSettingsPress}
				className="flex-row items-center gap-2 rounded-lg px-2 py-2"
				accessibilityRole="button"
				accessibilityLabel="Settings"
			>
				<Ionicons name="settings-outline" size={18} color="var(--color-icon)" />
				<AppText className="font-medium text-foreground text-sm">
					Settings
				</AppText>
			</Pressable>
			<Pressable
				onPress={onTogglePress}
				className="h-8 w-8 items-center justify-center rounded-lg"
				accessibilityRole="button"
				accessibilityLabel="Collapse sidebar"
			>
				<Ionicons name="chevron-back" size={18} color="var(--color-icon)" />
			</Pressable>
		</View>
	);
}
