import { View } from "react-native";
import type { Message, Part } from "@/domain/types";

export interface MessageBodyProps {
	message: Message;
	parts: Part[];
	isMobile?: boolean;
}

const isEmptyText = (part: Part): boolean => {
	if (part.type !== "text") return false;
	return !part.text || part.text.trim() === "";
};

export function MessageBody({
	message,
	parts,
	isMobile = false,
}: MessageBodyProps) {
	const nonEmptyParts = parts.filter((part) => !isEmptyText(part));

	const baseClassName =
		message.role === "user" ? "user-message" : "assistant-message";
	const mobileClass = isMobile ? "mobile" : "";

	return (
		<View testID="message-body" className={`${baseClassName} ${mobileClass}`}>
			{nonEmptyParts.map((part) => {
				if (part.type === "text") {
					const TextComponent =
						message.role === "assistant"
							? require("./message/parts/AssistantText").AssistantText
							: require("./message/parts/UserText").UserText;

					return (
						<TextComponent
							key={part.id}
							part={part}
							messageId={message.id}
							isMobile={isMobile}
						/>
					);
				}
				return null;
			})}
		</View>
	);
}
