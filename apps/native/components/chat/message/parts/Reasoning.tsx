import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import type { ReasoningPart } from "@/domain/types";

export interface ReasoningPartProps {
	part: ReasoningPart;
	messageId: string;
	expanded?: boolean;
	onToggle?: () => void;
}

function formatDuration(ms: number): string {
	if (ms < 1000) return `${ms}ms`;
	return `${(ms / 1000).toFixed(0)}s`;
}

export function ReasoningPartComponent({
	part,
	expanded: propExpanded,
	onToggle,
}: ReasoningPartProps) {
	const [internalExpanded, setInternalExpanded] = useState(false);
	const isExpanded =
		propExpanded !== undefined ? propExpanded : internalExpanded;
	const { text, time } = part;
	const hasDuration = time.end !== undefined;
	const duration = hasDuration && time.end ? time.end - time.start : null;

	const handleToggle = () => {
		if (onToggle) {
			onToggle();
		} else {
			setInternalExpanded(!internalExpanded);
		}
	};

	return (
		<View
			testID="reasoning"
			className="rounded-lg border border-border bg-muted/50 p-3"
		>
			<Pressable
				testID="reasoning-toggle"
				onPress={handleToggle}
				className="flex-row items-center gap-2"
			>
				<View
					testID="reasoning-icon"
					className="rounded-full bg-primary/10 p-1"
				>
					<Text className="text-lg text-primary">
						{isExpanded ? "💭" : "🔽"}
					</Text>
				</View>
				<Text className="font-medium text-foreground text-sm">Thinking</Text>
				{hasDuration && duration && (
					<Text className="text-muted-foreground text-xs">
						({formatDuration(duration)})
					</Text>
				)}
			</Pressable>

			{!isExpanded && <View testID="reasoning-collapsed" />}

			{isExpanded && (
				<View className="mt-2 rounded bg-background p-3">
					<Text className="text-foreground text-xs leading-relaxed">
						{text}
					</Text>
				</View>
			)}
		</View>
	);
}
