import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export interface CommitEditorProps {
	onCommit: (message: string) => void;
	isPending: boolean;
}

export function CommitEditor({ onCommit, isPending }: CommitEditorProps) {
	const [message, setMessage] = useState("");
	const [showEditor, setShowEditor] = useState(false);

	if (!showEditor) {
		return (
			<Pressable
				onPress={() => setShowEditor(true)}
				className="rounded-lg bg-primary p-4"
			>
				<Text className="text-center font-semibold text-primary-foreground">
					Create Commit
				</Text>
			</Pressable>
		);
	}

	const handleCommit = () => {
		const trimmed = message.trim();
		if (trimmed) {
			onCommit(trimmed);
			setMessage("");
			setShowEditor(false);
		}
	};

	return (
		<View className="gap-3">
			<TextInput
				className="min-h-[100px] rounded-lg border border-border bg-input p-3 text-foreground"
				placeholder="Commit message..."
				placeholderTextColor="#888"
				value={message}
				onChangeText={setMessage}
				multiline
				editable={!isPending}
			/>

			<View className="flex-row gap-3">
				<Pressable
					onPress={handleCommit}
					disabled={isPending || !message.trim()}
					className="flex-1 rounded-lg bg-primary p-4 disabled:opacity-50"
				>
					<Text className="text-center font-semibold text-primary-foreground">
						{isPending ? "Committing..." : "Commit"}
					</Text>
				</Pressable>

				<Pressable
					onPress={() => {
						setShowEditor(false);
						setMessage("");
					}}
					disabled={isPending}
					className="flex-1 rounded-lg bg-secondary p-4 disabled:opacity-50"
				>
					<Text className="text-center font-semibold text-secondary-foreground">
						Cancel
					</Text>
				</Pressable>
			</View>
		</View>
	);
}
