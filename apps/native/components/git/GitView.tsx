import { Pressable, ScrollView, Text, View } from "react-native";
import {
	useGitCommit,
	useGitPull,
	useGitPush,
	useGitStatus,
} from "@/lib/git/git-queries";
import { useWorkspaceSDK } from "@/lib/opencode-provider";
import { GitStatus as GitStatusComponent } from "./GitStatus";

export interface GitViewProps {
	directory: string;
}

export function GitView({ directory }: GitViewProps) {
	const { client } = useWorkspaceSDK();
	const { data: statusPty, isLoading } = useGitStatus(
		client,
		"workspace",
		directory,
	);
	const commitMutation = useGitCommit(client);
	const pushMutation = useGitPush(client);
	const pullMutation = useGitPull(client);

	const handleCommit = () => {
		commitMutation.mutate({
			directory,
			message: "Update from Opencoder",
		});
	};

	const handlePush = () => {
		pushMutation.mutate({ directory });
	};

	const handlePull = () => {
		pullMutation.mutate({ directory });
	};

	if (isLoading) {
		return (
			<View className="flex-1 items-center justify-center bg-background p-4">
				<Text className="text-foreground-weak">Loading git status...</Text>
			</View>
		);
	}

	return (
		<ScrollView className="flex-1 bg-background">
			{statusPty && <GitStatusComponent pty={statusPty} />}

			<View className="gap-3 p-4">
				<Text className="font-semibold text-foreground-strong">Actions</Text>

				<Pressable
					onPress={handleCommit}
					disabled={commitMutation.isPending}
					className="rounded-lg bg-primary p-4 disabled:opacity-50"
				>
					<Text className="text-center font-semibold text-primary-foreground">
						{commitMutation.isPending ? "Committing..." : "Commit Changes"}
					</Text>
				</Pressable>

				<View className="flex-row gap-3">
					<Pressable
						onPress={handlePush}
						disabled={pushMutation.isPending}
						className="flex-1 rounded-lg bg-secondary p-4 disabled:opacity-50"
					>
						<Text className="text-center font-semibold text-secondary-foreground">
							{pushMutation.isPending ? "Pushing..." : "Push"}
						</Text>
					</Pressable>

					<Pressable
						onPress={handlePull}
						disabled={pullMutation.isPending}
						className="flex-1 rounded-lg bg-secondary p-4 disabled:opacity-50"
					>
						<Text className="text-center font-semibold text-secondary-foreground">
							{pullMutation.isPending ? "Pulling..." : "Pull"}
						</Text>
					</Pressable>
				</View>
			</View>
		</ScrollView>
	);
}
