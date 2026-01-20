import { Text, View } from "react-native";
import type { TextPart } from "@/domain/types";

export interface AssistantTextProps {
	part: TextPart;
	messageId: string;
	isMobile?: boolean;
	isStreaming?: boolean;
	isComplete?: boolean;
}

export function AssistantText({
	part,
	isMobile = false,
	isStreaming = false,
	isComplete = true,
}: AssistantTextProps) {
	const baseClassName = "assistant-text";
	const streamingClass = isStreaming ? "streaming" : "";
	const mobileClass = isMobile ? "mobile" : "";

	return (
		<View
			testID="assistant-text"
			className={`${baseClassName} ${streamingClass} ${mobileClass}`}
		>
			{part.text.split("\n").map((line) => (
				<Text key={line}>{line}</Text>
			))}
			{isStreaming && !isComplete && (
				<View
					testID="streaming-cursor"
					className="inline-block h-4 w-1 bg-foreground"
				/>
			)}
		</View>
	);
}
