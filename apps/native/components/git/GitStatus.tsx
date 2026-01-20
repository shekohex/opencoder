import type { Pty } from "@opencode-ai/sdk";
import { Text, View } from "react-native";

export interface GitStatusProps {
	pty: Pty;
}

export function GitStatus({ pty }: GitStatusProps) {
	return (
		<View className="border-border border-b bg-card p-4">
			<View className="mb-2 flex-row items-center justify-between">
				<Text className="font-semibold text-foreground-strong">Git Status</Text>
				<Text className="text-foreground-weak text-sm">
					{pty.status === "running" ? "Running..." : "Exited"}
				</Text>
			</View>
			<View className="gap-1">
				<Text className="text-foreground text-sm">
					<Text className="text-foreground-weak">Command:</Text> {pty.command}{" "}
					{pty.args.join(" ")}
				</Text>
				<Text className="text-foreground text-sm">
					<Text className="text-foreground-weak">Directory:</Text> {pty.cwd}
				</Text>
				<Text className="text-foreground text-sm">
					<Text className="text-foreground-weak">PID:</Text> {pty.pid}
				</Text>
			</View>
		</View>
	);
}
