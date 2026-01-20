import type { Pty } from "@opencode-ai/sdk";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useOpenCodeConnection } from "@/lib/opencode-provider";
import {
	useTerminalCreate,
	useTerminalDelete,
	useTerminalList,
} from "@/lib/terminal/terminal-queries";

interface TerminalProps {
	workspaceId: string;
	directory: string;
}

export function Terminal({ workspaceId, directory }: TerminalProps) {
	const { client } = useOpenCodeConnection(workspaceId);
	const { data: terminals = [] } = useTerminalList(
		client ?? null,
		workspaceId,
		directory,
	);
	const createMutation = useTerminalCreate(client ?? null);
	const deleteMutation = useTerminalDelete(client ?? null);

	const handleCreateTerminal = () => {
		createMutation.mutate({
			cwd: directory,
			command: "bash",
			args: [],
		});
	};

	const handleCloseTerminal = (ptyId: string) => {
		deleteMutation.mutate({ ptyId });
	};

	const handleTerminalPress = (pty: Pty) => {
		console.log("Open terminal:", pty.id);
	};

	return (
		<View testID="terminal-container" style={{ flex: 1 }}>
			<View testID="terminal-list" style={{ flex: 1 }}>
				{terminals.length === 0 ? (
					<View style={{ padding: 16, alignItems: "center" }}>
						<Text testID="no-terminals-text">No terminals running</Text>
					</View>
				) : (
					<FlatList
						testID="terminal-item-list"
						data={terminals}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => (
							<View
								testID="terminal-item"
								style={{
									flexDirection: "row",
									padding: 12,
									borderBottomWidth: 1,
									borderBottomColor: "#e0e0e0",
								}}
							>
								<TouchableOpacity
									testID="terminal-press-area"
									onPress={() => handleTerminalPress(item)}
									style={{ flex: 1 }}
								>
									<Text style={{ fontWeight: "600" }}>{item.title}</Text>
									<Text style={{ fontSize: 12, color: "#666" }}>
										{item.command} - {item.status}
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									testID="close-terminal-action"
									onPress={() => handleCloseTerminal(item.id)}
									style={{ padding: 8 }}
								>
									<Text style={{ color: "red" }}>×</Text>
								</TouchableOpacity>
							</View>
						)}
					/>
				)}
			</View>
			<TouchableOpacity
				testID="create-terminal-button"
				onPress={handleCreateTerminal}
				style={{
					padding: 16,
					backgroundColor: "#007AFF",
					alignItems: "center",
				}}
			>
				<Text style={{ color: "white", fontWeight: "600" }}>
					+ New Terminal
				</Text>
			</TouchableOpacity>
		</View>
	);
}
