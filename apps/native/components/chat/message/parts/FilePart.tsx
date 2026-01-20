import { Text, View } from "react-native";
import type { FilePart } from "@/domain/types";

export interface FilePartComponentProps {
	part: FilePart;
	messageId: string;
}

function _formatFileSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function getFileIconType(mime: string): "image" | "code" | "generic" {
	if (mime.startsWith("image/")) return "image";
	if (
		mime.includes("typescript") ||
		mime.includes("javascript") ||
		mime.includes("json")
	) {
		return "code";
	}
	return "generic";
}

export function FilePartComponent({ part }: FilePartComponentProps) {
	const { filename, mime } = part;
	const iconType = getFileIconType(mime);
	const displayFilename = filename || "Untitled";

	return (
		<View
			testID="file-part"
			className="rounded-lg border border-border bg-muted p-3"
		>
			<View className="flex-row items-center gap-3">
				<View
					testID={`file-icon-${iconType}`}
					className="rounded bg-primary/10 p-2"
				>
					<Text className="text-lg text-primary">
						{iconType === "image" ? "🖼️" : iconType === "code" ? "📄" : "📎"}
					</Text>
				</View>

				<View className="flex-1">
					<Text className="font-medium text-foreground text-sm">
						{displayFilename}
					</Text>
				</View>
			</View>
		</View>
	);
}
