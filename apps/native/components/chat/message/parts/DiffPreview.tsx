import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import type { PatchPart } from "@/domain/types";

const MAX_VISIBLE_FILES = 5;

export interface DiffPreviewProps {
	part: PatchPart;
	messageId: string;
}

interface FileGroup {
	directory: string;
	files: string[];
}

function groupFilesByDirectory(files: string[]): FileGroup[] {
	const groups: Map<string, string[]> = new Map();

	for (const file of files) {
		const parts = file.split("/");
		const dir = parts.length > 1 ? parts.slice(0, -1).join("/") : "";
		if (!groups.has(dir)) {
			groups.set(dir, []);
		}
		groups.get(dir)?.push(file);
	}

	return Array.from(groups.entries())
		.map(([directory, files]) => ({ directory, files }))
		.sort((a, b) => a.directory.localeCompare(b.directory));
}

function getFileExtension(filename: string): string {
	const parts = filename.split(".");
	return parts.length > 1 ? parts[parts.length - 1] : "";
}

export function DiffPreview({ part }: DiffPreviewProps) {
	const { files, hash } = part;
	const [isExpanded, setIsExpanded] = useState(
		files.length <= MAX_VISIBLE_FILES,
	);

	const shouldCollapse = files.length > MAX_VISIBLE_FILES;
	const visibleFiles = isExpanded ? files : files.slice(0, MAX_VISIBLE_FILES);
	const groupedFiles = groupFilesByDirectory(visibleFiles);
	const fileCount = files.length;
	const fileLabel = fileCount === 1 ? "1 file" : `${fileCount} files`;

	return (
		<View
			testID="diff-preview"
			className="rounded-lg border border-border bg-muted p-3"
		>
			<View className="mb-2 flex-row items-center gap-2">
				<View className="rounded bg-primary/10 p-1">
					<Text className="text-primary text-sm">📝</Text>
				</View>
				<Text className="font-medium text-foreground text-sm">{fileLabel}</Text>
				{hash && (
					<Text className="font-mono text-muted-foreground text-xs">
						{hash.slice(0, 8)}
					</Text>
				)}
			</View>

			{fileCount === 0 ? (
				<Text className="text-muted-foreground text-sm">No files</Text>
			) : (
				<View className="gap-1">
					{groupedFiles.map((group) => (
						<View key={group.directory}>
							{group.directory && (
								<Text className="mt-2 mb-1 font-medium text-muted-foreground text-xs">
									{group.directory}
								</Text>
							)}
							{group.files.map((file) => {
								const ext = getFileExtension(file);
								return (
									<View key={file} className="flex-row items-center gap-2 py-1">
										<View testID={`file-icon-${ext}`} className="w-4">
											<Text className="text-muted-foreground text-xs">
												{ext === "ts" || ext === "tsx"
													? "📘"
													: ext === "png" || ext === "jpg"
														? "🖼️"
														: "📄"}
											</Text>
										</View>
										<Text className="text-foreground text-xs">{file}</Text>
									</View>
								);
							})}
						</View>
					))}

					{shouldCollapse && !isExpanded && (
						<Text className="mt-2 text-muted-foreground text-xs italic">
							...and {files.length - MAX_VISIBLE_FILES} more
						</Text>
					)}

					{shouldCollapse && (
						<Pressable
							testID="diff-expand"
							onPress={() => setIsExpanded(!isExpanded)}
							className="mt-2"
						>
							<Text className="font-medium text-primary text-xs">
								{isExpanded ? "Show less" : "Show all"}
							</Text>
						</Pressable>
					)}
				</View>
			)}
		</View>
	);
}
