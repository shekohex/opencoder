import { Text, View } from "react-native";
import type { ToolPart } from "@/domain/types";

export interface ToolUseProps {
	part: ToolPart;
	messageId: string;
}

function formatDuration(ms: number): string {
	if (ms < 1000) return `${ms}ms`;
	return `${(ms / 1000).toFixed(1)}s`;
}

export function ToolUse({ part }: ToolUseProps) {
	const { tool, state } = part;
	const isCompleted = state.status === "completed";
	const isRunning = state.status === "running";
	const isError = state.status === "error";
	const _isPending = state.status === "pending";

	const title = isCompleted
		? state.title
		: state.status === "running"
			? state.title
			: undefined;
	const output = isCompleted ? state.output : undefined;
	const error = isError ? state.error : undefined;
	const duration =
		isCompleted && state.time.end
			? state.time.end - state.time.start
			: undefined;

	return (
		<View
			testID="tool-use"
			className="rounded-lg border border-border bg-muted p-3"
		>
			<View className="mb-2 flex-row items-center gap-2">
				<View className="rounded bg-primary/10 px-2 py-0.5 text-primary">
					<Text className="font-medium text-primary text-xs">{tool}</Text>
				</View>
				{title && (
					<Text className="font-medium text-foreground text-sm">{title}</Text>
				)}
				{isRunning && (
					<View
						testID="tool-loading"
						className="h-2 w-2 animate-pulse rounded-full bg-primary"
					/>
				)}
				{isError && (
					<View
						testID="tool-error"
						className="h-2 w-2 rounded-full bg-destructive"
					/>
				)}
			</View>

			{output && (
				<View className="rounded bg-background p-2">
					<Text className="text-foreground text-xs">{output}</Text>
				</View>
			)}

			{error && (
				<View className="rounded bg-destructive/10 p-2">
					<Text className="text-destructive text-xs">{error}</Text>
				</View>
			)}

			{duration && (
				<Text className="mt-2 text-muted-foreground text-xs">
					{formatDuration(duration)}
				</Text>
			)}
		</View>
	);
}
