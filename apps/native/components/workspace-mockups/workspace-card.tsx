import { Feather } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
} from "react-native-reanimated";

import { AppText } from "@/components/app-text";
import { TooltipBadge } from "@/components/tooltip-badge";

import type { StatusTone, WorkspaceBadge, WorkspaceRowData } from "./mock-data";

const STATUS_DOT_STYLES: Record<StatusTone, { dot: string; ring: string }> = {
	success: {
		dot: "bg-surface-success",
		ring: "bg-surface-success",
	},
	warning: {
		dot: "bg-surface-warning",
		ring: "bg-surface-warning",
	},
	inactive: {
		dot: "bg-surface-weak",
		ring: "bg-surface-weak",
	},
	error: {
		dot: "bg-surface-danger",
		ring: "bg-surface-danger",
	},
};

const BADGE_STYLES: Record<
	WorkspaceBadge,
	{ icon: keyof typeof Feather.glyphMap; label: string; color: string }
> = {
	favorite: {
		icon: "star",
		label: "Favorite",
		color: "var(--color-icon-interactive)",
	},
	shared: {
		icon: "users",
		label: "Shared",
		color: "var(--color-icon)",
	},
	task: {
		icon: "check-square",
		label: "Task",
		color: "var(--color-icon-success)",
	},
	outdated: {
		icon: "alert-triangle",
		label: "Outdated",
		color: "var(--color-icon-warning)",
	},
};

function PulseDot({
	tone,
	isPulsing,
}: {
	tone: StatusTone;
	isPulsing: boolean;
}) {
	const styles = STATUS_DOT_STYLES[tone];
	const pulse = useSharedValue(0);

	useEffect(() => {
		if (isPulsing) {
			pulse.value = withRepeat(
				withTiming(1, { duration: 1400, easing: Easing.out(Easing.ease) }),
				-1,
				false,
			);
			return;
		}
		pulse.value = 0;
	}, [isPulsing, pulse]);

	const ringStyle = useAnimatedStyle(() => ({
		opacity: isPulsing ? 0.35 * (1 - pulse.value) + 0.05 : 0,
		transform: [{ scale: 1 + pulse.value * 1.9 }],
	}));

	return (
		<View className="relative h-3 w-3 items-center justify-center">
			{isPulsing && (
				<Animated.View
					className={`absolute h-3 w-3 rounded-full ${styles.ring}`}
					style={ringStyle}
				/>
			)}
			<View className={`h-2.5 w-2.5 rounded-full ${styles.dot}`} />
		</View>
	);
}

function StatusIndicator({
	tone,
	label,
	isPulsing,
}: {
	tone: StatusTone;
	label: string;
	isPulsing: boolean;
}) {
	return (
		<TooltipBadge label={label}>
			<View className="h-6 w-6 items-center justify-center rounded-full bg-surface-weak">
				<PulseDot tone={tone} isPulsing={isPulsing} />
			</View>
		</TooltipBadge>
	);
}

function BadgeIcon({ badge }: { badge: WorkspaceBadge }) {
	const config = BADGE_STYLES[badge];

	return (
		<TooltipBadge label={config.label}>
			<View className="h-6 w-6 items-center justify-center rounded-full bg-surface-weak">
				<Feather name={config.icon} size={12} color={config.color} />
			</View>
		</TooltipBadge>
	);
}

export function WorkspaceCard({
	row,
	ownerInitials,
	rowHeight,
	isSelected,
	avatar,
	onPress,
}: {
	row: WorkspaceRowData;
	ownerInitials: string;
	rowHeight: number;
	isSelected?: boolean;
	avatar?: ReactNode;
	onPress?: () => void;
}) {
	const visibleBadges = row.badges.slice(0, 3);
	const hiddenBadgeCount = row.badges.length - visibleBadges.length;
	const isPulsing =
		row.statusTone === "success" && row.status.toLowerCase() === "running";

	const CardContent = (
		<View
			className={`flex-row items-center gap-3 px-4 ${
				isSelected ? "border-border-selected bg-surface" : "bg-transparent"
			}`}
			style={{
				minHeight: rowHeight,
				paddingVertical: 13,
				justifyContent: "center",
			}}
		>
			<View className="h-9 w-9 items-center justify-center rounded-full bg-surface-weak">
				{avatar ?? (
					<AppText className="font-semibold text-foreground-strong text-xs">
						{ownerInitials}
					</AppText>
				)}
			</View>
			<View className="flex-1 gap-1">
				<View className="flex-row items-center justify-between gap-2">
					<AppText
						className="font-semibold text-foreground-strong text-sm"
						numberOfLines={1}
						style={{ flex: 1, paddingRight: 8 }}
					>
						{row.name}
					</AppText>
					<View style={{ minWidth: 28, alignItems: "flex-end", flexShrink: 0 }}>
						<StatusIndicator
							tone={row.statusTone}
							label={row.status}
							isPulsing={isPulsing}
						/>
					</View>
				</View>
				<View className="flex-row items-center justify-between">
					<AppText className="text-foreground-weak text-xs" numberOfLines={1}>
						Last used {row.lastUsed}
					</AppText>
					<View className="flex-row items-center gap-4">
						{visibleBadges.map((badge) => (
							<BadgeIcon key={`${row.name}-${badge}`} badge={badge} />
						))}
						{hiddenBadgeCount > 0 && (
							<TooltipBadge label={`${hiddenBadgeCount} more badges`}>
								<View className="h-6 w-6 items-center justify-center rounded-full bg-surface-weak">
									<Feather
										name="more-horizontal"
										size={12}
										color="var(--color-icon)"
									/>
								</View>
							</TooltipBadge>
						)}
					</View>
				</View>
			</View>
		</View>
	);

	if (onPress) {
		return (
			<Pressable
				onPress={onPress}
				accessibilityRole="button"
				className="focus-ring flex-1 rounded-lg"
			>
				{CardContent}
			</Pressable>
		);
	}

	return <View className="flex-1">{CardContent}</View>;
}
