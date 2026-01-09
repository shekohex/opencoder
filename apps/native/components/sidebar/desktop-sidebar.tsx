import type { ReactNode } from "react";
import { View } from "react-native";
import { SidebarFooter } from "./sidebar-footer";
import { type ConnectionStatus, SidebarHeader } from "./sidebar-header";

export function DesktopSidebar({
	collapsed = false,
	status = "disconnected",
	onSettingsPress,
	onTogglePress,
	children,
}: {
	collapsed?: boolean;
	status?: ConnectionStatus;
	onSettingsPress?: () => void;
	onTogglePress?: () => void;
	children?: ReactNode;
}) {
	return (
		<View className="h-full flex-1 border-border border-r bg-background">
			<SidebarHeader status={status} collapsed={collapsed} />
			<View className="flex-1 overflow-hidden">{children}</View>
			<SidebarFooter
				collapsed={collapsed}
				onSettingsPress={onSettingsPress}
				onTogglePress={onTogglePress}
			/>
		</View>
	);
}
