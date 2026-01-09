import type { ReactNode } from "react";
import { View } from "react-native";
import Animated, {
	useAnimatedStyle,
	withSpring,
} from "react-native-reanimated";
import {
	SIDEBAR_COLLAPSED_WIDTH,
	SIDEBAR_EXPANDED_MIN_WIDTH,
} from "@/lib/sidebar-state";
import { SidebarFooter } from "./sidebar-footer";
import { type ConnectionStatus, SidebarHeader } from "./sidebar-header";

const SPRING_CONFIG = {
	damping: 20,
	stiffness: 200,
	mass: 0.8,
};

export function DesktopSidebar({
	collapsed = false,
	width = SIDEBAR_EXPANDED_MIN_WIDTH,
	status = "disconnected",
	onSettingsPress,
	onTogglePress,
	children,
}: {
	collapsed?: boolean;
	width?: number;
	status?: ConnectionStatus;
	onSettingsPress?: () => void;
	onTogglePress?: () => void;
	children?: ReactNode;
}) {
	const targetWidth = collapsed ? SIDEBAR_COLLAPSED_WIDTH : width;

	const animatedStyle = useAnimatedStyle(() => ({
		width: withSpring(targetWidth, SPRING_CONFIG),
		minWidth: withSpring(targetWidth, SPRING_CONFIG),
	}));

	return (
		<Animated.View
			className="h-full border-border border-r bg-background"
			style={animatedStyle}
		>
			<SidebarHeader status={status} collapsed={collapsed} />
			<View className="flex-1 overflow-hidden">{children}</View>
			<SidebarFooter
				collapsed={collapsed}
				onSettingsPress={onSettingsPress}
				onTogglePress={onTogglePress}
			/>
		</Animated.View>
	);
}
