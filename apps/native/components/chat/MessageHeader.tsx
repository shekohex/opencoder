import { ActivityIndicator, View } from "react-native";
import type { MessageRole } from "@/domain/types";
import { AppText } from "../app-text";

export interface MessageHeaderProps {
	messageId: string;
	role: MessageRole;
	agentName?: string;
	modelName?: string;
	providerId?: string;
	status: "pending" | "completed" | "error";
	timestamp: number;
}

export function MessageHeader({
	role,
	agentName,
	modelName,
	status,
	timestamp,
}: MessageHeaderProps) {
	const formatTime = (ts: number) => {
		const date = new Date(ts);
		return date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		});
	};

	return (
		<View className="mb-1 flex-row items-center gap-2">
			{role === "user" ? (
				<AppText className="font-medium text-foreground text-sm">You</AppText>
			) : (
				<>
					{agentName && (
						<AppText className="font-medium text-foreground-weak text-sm">
							{agentName}
						</AppText>
					)}
					<AppText className="text-foreground text-sm">{modelName}</AppText>
				</>
			)}
			{status === "pending" && (
				<ActivityIndicator
					testID="status-indicator"
					size="small"
					className="ml-1"
				/>
			)}
			<AppText className="ml-auto text-foreground-weak text-xs">
				{formatTime(timestamp)}
			</AppText>
		</View>
	);
}
