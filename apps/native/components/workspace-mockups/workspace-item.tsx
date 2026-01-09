import type { ReactNode } from "react";
import { View } from "react-native";

import { AppText } from "@/components/app-text";

import type { StatusTone, WorkspaceRowData } from "./mock-data";

const STATUS_STYLES: Record<StatusTone, { pill: string; dot: string }> = {
	success: {
		pill: "bg-surface-success text-foreground-success border-border-success",
		dot: "bg-surface-success",
	},
	warning: {
		pill: "bg-surface-warning text-foreground-warning border-border-warning",
		dot: "bg-surface-warning",
	},
	inactive: {
		pill: "bg-surface-weak text-foreground-weak border-border",
		dot: "bg-surface-weak",
	},
	error: {
		pill: "bg-surface-danger text-foreground-danger border-border-danger",
		dot: "bg-surface-danger",
	},
};

export function WorkspaceStatusPill({
	status,
	tone,
}: {
	status: string;
	tone: StatusTone;
}) {
	const styles = STATUS_STYLES[tone];

	return (
		<View
			className={`flex-row items-center gap-2 rounded-full border px-2 py-1 ${styles.pill}`}
		>
			<View className={`h-2 w-2 rounded-full ${styles.dot}`} />
			<AppText className="font-medium text-xs">{status}</AppText>
		</View>
	);
}

export function WorkspaceBadgePill({ label }: { label: string }) {
	return (
		<View className="rounded-full bg-surface-weak px-2 py-0.5">
			<AppText className="text-foreground-weak text-xs uppercase">
				{label}
			</AppText>
		</View>
	);
}

export function WorkspaceItem({
	row,
	ownerInitials,
	rowHeight,
	isSelected,
	avatar,
}: {
	row: WorkspaceRowData;
	ownerInitials: string;
	rowHeight: number;
	isSelected?: boolean;
	avatar?: ReactNode;
}) {
	const visibleBadges = row.badges.slice(0, 2);
	const hiddenBadgeCount = row.badges.length - visibleBadges.length;

	return (
		<View
			className={`flex-row items-center gap-3 rounded-xl border px-3 ${
				isSelected
					? "border-border-selected bg-surface"
					: "border-border bg-transparent"
			}`}
			style={{ height: rowHeight }}
		>
			<View className="h-8 w-8 items-center justify-center rounded-full bg-surface-weak">
				{avatar ?? (
					<AppText className="font-semibold text-foreground-strong text-xs">
						{ownerInitials}
					</AppText>
				)}
			</View>
			<View className="flex-1 gap-1">
				<View className="flex-row items-center justify-between gap-2">
					<AppText
						className="font-medium text-foreground-strong text-sm"
						numberOfLines={1}
					>
						{row.name}
					</AppText>
					<View style={{ minWidth: 88, alignItems: "flex-end" }}>
						<WorkspaceStatusPill status={row.status} tone={row.statusTone} />
					</View>
				</View>
				<View className="flex-row flex-wrap items-center gap-2">
					<AppText className="text-foreground-weak text-xs" numberOfLines={1}>
						Last used {row.lastUsed}
					</AppText>
					{visibleBadges.map((badge) => (
						<WorkspaceBadgePill key={`${row.name}-${badge}`} label={badge} />
					))}
					{hiddenBadgeCount > 0 && (
						<WorkspaceBadgePill label={`+${hiddenBadgeCount}`} />
					)}
				</View>
			</View>
		</View>
	);
}
