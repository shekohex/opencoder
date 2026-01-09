import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Pressable, View } from "react-native";
import Animated, {
	useAnimatedStyle,
	withSpring,
} from "react-native-reanimated";
import { AppText } from "@/components/app-text";
import { SESSIONS_SIDEBAR_MIN_WIDTH } from "@/lib/sidebar-state";

const SPRING_CONFIG = {
	damping: 20,
	stiffness: 200,
	mass: 0.8,
};

export function SessionsSidebar({
	collapsed = true,
	width = SESSIONS_SIDEBAR_MIN_WIDTH,
	projectName,
	onTogglePress,
	onNewSessionPress,
	children,
}: {
	collapsed?: boolean;
	width?: number;
	projectName?: string;
	onTogglePress?: () => void;
	onNewSessionPress?: () => void;
	children?: ReactNode;
}) {
	const targetWidth = collapsed ? 0 : width;

	const animatedStyle = useAnimatedStyle(() => ({
		width: withSpring(targetWidth, SPRING_CONFIG),
		opacity: withSpring(collapsed ? 0 : 1, SPRING_CONFIG),
	}));

	if (collapsed) {
		return null;
	}

	return (
		<Animated.View
			className="h-full border-border border-r bg-background"
			style={animatedStyle}
		>
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
		</Animated.View>
	);
}
