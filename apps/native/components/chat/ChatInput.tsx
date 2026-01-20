import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

import { useChatMutations } from "@/lib/chat/chat-mutations";

export interface ChatInputProps {
	workspaceId: string;
	sessionId: string;
	disabled?: boolean;
	onSendMessage?: (text: string) => void;
}

export function ChatInput({
	workspaceId,
	sessionId,
	disabled = false,
	onSendMessage,
}: ChatInputProps) {
	const [text, setText] = useState("");

	const sendMessageMutation = useChatMutations(
		workspaceId,
		sessionId,
	).sendMessage;

	const handleSend = () => {
		const trimmedText = text.trim();
		if (!trimmedText) return;

		if (onSendMessage) {
			onSendMessage(trimmedText);
		} else {
			sendMessageMutation.mutate(
				{ text: trimmedText },
				{
					onError: (error) => {
						console.error("Failed to send message:", error);
					},
				},
			);
		}
		setText("");
	};

	const canSend =
		text.trim().length > 0 && !disabled && !sendMessageMutation.isPending;

	return (
		<View className="border-t border-t-foreground/10 bg-card p-3">
			<View className="flex-row items-end gap-2">
				<TextInput
					testID="chat-input"
					className="max-h-[120px] min-h-[40px] flex-1 rounded-lg border border-border bg-input px-3 py-2 text-base text-foreground"
					placeholder="Message OpenCode..."
					placeholderTextColor="#888"
					value={text}
					onChangeText={setText}
					onSubmitEditing={() => {
						if (canSend) handleSend();
					}}
					multiline
					editable={!disabled}
					style={{ fontSize: 16 }}
				/>
				<TouchableOpacity
					testID="send-button"
					className={`h-10 w-10 items-center justify-center rounded-full ${
						canSend ? "bg-primary" : "bg-foreground/20"
					}`}
					onPress={handleSend}
					disabled={!canSend}
				>
					<Ionicons name="send" size={18} color={canSend ? "#fff" : "#888"} />
				</TouchableOpacity>
			</View>
			{sendMessageMutation.isPending && (
				<Text className="mt-2 text-foreground-weak text-sm">Sending...</Text>
			)}
		</View>
	);
}
