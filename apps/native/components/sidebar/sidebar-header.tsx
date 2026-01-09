import { Icon, Logo } from "@opencoder/branding";
import { View } from "react-native";
import { AppText } from "@/components/app-text";
import { useTheme } from "@/lib/theme-context";

export type ConnectionStatus =
	| "connected"
	| "connecting"
	| "disconnected"
	| "error";

const STATUS_CONFIG: Record<
	ConnectionStatus,
	{ label: string; dotClass: string; textClass: string; isPulsing: boolean }
> = {
	connected: {
		label: "Connected",
		dotClass: "bg-surface-success",
		textClass: "text-surface-success",
		isPulsing: false,
	},
	connecting: {
		label: "Connecting",
		dotClass: "bg-surface-warning",
		textClass: "text-surface-warning",
		isPulsing: true,
	},
	disconnected: {
		label: "Disconnected",
		dotClass: "bg-surface-weak",
		textClass: "text-foreground-weak",
		isPulsing: false,
	},
	error: {
		label: "Error",
		dotClass: "bg-surface-critical",
		textClass: "text-surface-critical",
		isPulsing: false,
	},
};

export function SidebarHeader({
	status = "disconnected",
	collapsed = false,
}: {
	status?: ConnectionStatus;
	collapsed?: boolean;
}) {
	const { mode } = useTheme();
	const statusConfig = STATUS_CONFIG[status];

	if (collapsed) {
		return (
			<View className="items-center justify-center border-border border-b py-4">
				<Icon mode={mode} size={32} />
			</View>
		);
	}

	return (
		<View className="flex-row items-center justify-between border-border border-b px-4 py-3">
			<Logo mode={mode} width={120} height={24} />
			<View className="flex-row items-center gap-2">
				<View className={`h-2 w-2 rounded-full ${statusConfig.dotClass}`} />
				<AppText className={`text-xs ${statusConfig.textClass}`}>
					{statusConfig.label}
				</AppText>
			</View>
		</View>
	);
}
