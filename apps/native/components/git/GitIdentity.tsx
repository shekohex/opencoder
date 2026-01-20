import type { Pty } from "@opencode-ai/sdk";
import { Text, View } from "react-native";

export interface GitIdentityProps {
	pty: Pty | null;
	isLoading: boolean;
}

export function GitIdentity({ pty, isLoading }: GitIdentityProps) {
	return (
		<View className="border-border border-b bg-card p-4">
			<Text className="mb-3 font-semibold text-foreground-strong">
				Git Identity
			</Text>

			{isLoading ? (
				<Text className="text-foreground-weak text-sm">Loading...</Text>
			) : pty ? (
				<View className="gap-2">
					<View>
						<Text className="text-foreground-weak text-sm">Command</Text>
						<Text className="font-mono text-foreground text-sm">
							{pty.command} {pty.args.join(" ")}
						</Text>
					</View>
					<View>
						<Text className="text-foreground-weak text-sm">Directory</Text>
						<Text className="font-mono text-foreground text-sm">{pty.cwd}</Text>
					</View>
					<View>
						<Text className="text-foreground-weak text-sm">PID</Text>
						<Text className="font-mono text-foreground text-sm">{pty.pid}</Text>
					</View>
				</View>
			) : (
				<Text className="text-foreground-weak text-sm">Not configured</Text>
			)}
		</View>
	);
}
