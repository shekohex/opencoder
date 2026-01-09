import { Feather } from "@expo/vector-icons";
import { useMemo } from "react";
import { View } from "react-native";

import { AppText } from "@/components/app-text";
import { Button } from "@/components/button";

export type ListState = "ready" | "loading" | "empty" | "error";

export function ErrorBanner({
	title,
	subtitle,
	ctaLabel,
	onPress,
}: {
	title: string;
	subtitle: string;
	ctaLabel: string;
	onPress?: () => void;
}) {
	return (
		<View className="gap-2 rounded-xl border border-border-critical bg-surface-critical px-3 py-3">
			<View className="flex-row items-center gap-2">
				<Feather name="alert-triangle" size={14} color="var(--color-icon)" />
				<AppText className="font-semibold text-foreground-strong text-sm">
					{title}
				</AppText>
			</View>
			<AppText className="text-foreground-weak text-xs">{subtitle}</AppText>
			<Button
				size="sm"
				variant="outline"
				accessibilityLabel={ctaLabel}
				onPress={onPress}
			>
				{ctaLabel}
			</Button>
		</View>
	);
}

export function EmptyStateCard({
	title,
	subtitle,
	ctaLabel,
	onPress,
}: {
	title: string;
	subtitle: string;
	ctaLabel?: string;
	onPress?: () => void;
}) {
	return (
		<View className="gap-2 rounded-xl border border-border bg-surface px-3 py-3">
			<AppText className="font-semibold text-foreground-strong text-sm">
				{title}
			</AppText>
			<AppText className="text-foreground-weak text-xs">{subtitle}</AppText>
			{ctaLabel && (
				<Button
					size="sm"
					variant="outline"
					onPress={onPress}
					accessibilityLabel={ctaLabel}
				>
					{ctaLabel}
				</Button>
			)}
		</View>
	);
}

export function LoadingList({
	count,
	rowHeight,
}: {
	count: number;
	rowHeight: number;
}) {
	const keys = useMemo(
		() =>
			Array.from(
				{ length: count },
				() => `Skeleton-${Math.random().toString(36).slice(2)}`,
			),
		[count],
	);

	return (
		<View className="gap-3 px-3 py-3">
			{keys.map((key) => (
				<View
					key={key}
					className="justify-center rounded-xl border border-border bg-surface px-3"
					style={{ height: rowHeight }}
				>
					<View className="gap-2">
						<View className="h-3 w-2/3 rounded-full bg-surface-weak" />
						<View className="h-3 w-1/3 rounded-full bg-surface-weak" />
					</View>
				</View>
			))}
		</View>
	);
}
