import { useTooltip, useTooltipTrigger } from "@react-native-aria/tooltip";
import { useTooltipTriggerState } from "@react-stately/tooltip";
import type { ReactNode } from "react";
import { useRef } from "react";
import { View } from "react-native";

import { AppText } from "@/components/app-text";

export function TooltipBadge({
	label,
	children,
}: {
	label: string;
	children: ReactNode;
}) {
	const state = useTooltipTriggerState({
		delay: 250,
		closeDelay: 100,
		trigger: "hover",
	});
	const triggerRef = useRef<View>(null);
	const { triggerProps, tooltipProps } = useTooltipTrigger(
		{
			delay: 250,
			closeDelay: 100,
			trigger: "hover",
		},
		state,
		triggerRef as unknown as React.RefObject<HTMLElement>,
	);
	const { tooltipProps: ariaTooltipProps } = useTooltip({});

	return (
		<View className="relative items-center">
			<View
				ref={triggerRef}
				{...(triggerProps as object)}
				accessibilityLabel={label}
			>
				{children}
			</View>
			{state.isOpen && (
				<View
					{...(tooltipProps as object)}
					{...(ariaTooltipProps as object)}
					className="absolute top-7 z-50 rounded-md border border-border bg-surface-strong px-2 py-1 shadow-md"
					style={{ maxWidth: 180 }}
				>
					<AppText className="text-foreground text-xs">{label}</AppText>
				</View>
			)}
		</View>
	);
}
