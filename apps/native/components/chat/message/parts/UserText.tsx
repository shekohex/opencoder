import { Text, View } from "react-native";
import type { TextPart } from "@/domain/types";

export interface UserTextProps {
	part: TextPart;
	messageId: string;
	isMobile?: boolean;
}

export function UserText({ part, isMobile = false }: UserTextProps) {
	const baseClassName = "user-text";
	const mobileClass = isMobile ? "mobile" : "";
	const displayText =
		part.text.length > 100 ? part.text.slice(0, 100) : part.text;

	return (
		<View testID="user-text" className={`${baseClassName} ${mobileClass}`}>
			{displayText.split("\n").map((line) => (
				<Text key={line}>{line}</Text>
			))}
		</View>
	);
}
