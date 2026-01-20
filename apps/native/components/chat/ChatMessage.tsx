import { View } from "react-native";
import type { ChatMessageData } from "@/lib/chat/chat-queries";
import { MessageBody } from "./MessageBody";
import { MessageHeader } from "./MessageHeader";

export interface ChatMessageProps {
	message: ChatMessageData;
	isMobile?: boolean;
}

function getMessageStatus(
	message: ChatMessageData,
): "pending" | "completed" | "error" {
	if (message.role === "user") return "completed";
	if (message.error) return "error";
	return message.time.completed ? "completed" : "pending";
}

export function ChatMessage({ message, isMobile = false }: ChatMessageProps) {
	const role = message.role;
	const status = getMessageStatus(message);

	const isUser = role === "user";

	return (
		<View
			className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
			testID={`chat-message-${role}`}
		>
			<View
				className={`max-w-[85%] rounded-xl px-3 py-2 ${
					isUser ? "bg-surface-interactive" : "bg-surface"
				}`}
			>
				{!isUser && (
					<MessageHeader
						messageId={message.id}
						role={role}
						modelName={message.modelID ?? "Unknown"}
						status={status}
						timestamp={message.time.created}
					/>
				)}
				<MessageBody
					message={message as never}
					parts={message.parts as never}
					isMobile={isMobile}
				/>
			</View>
		</View>
	);
}
