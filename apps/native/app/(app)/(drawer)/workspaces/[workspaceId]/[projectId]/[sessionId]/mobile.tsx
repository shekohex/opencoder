import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";

import { AppText } from "@/components/app-text";
import { Button } from "@/components/button";
import { ChatInput } from "@/components/chat/ChatInput";
import { MessageList } from "@/components/chat/MessageList";
import { Container } from "@/components/container";
import { PermissionRequest } from "@/components/permissions/PermissionRequest";
import { useSessionMessages } from "@/lib/chat/chat-queries";
import { WorkspaceSDKProvider } from "@/lib/opencode-provider";
import { useProjectName } from "@/lib/project-queries";
import { useSessionById } from "@/lib/session-queries";
import { useWorkspaceNav } from "@/lib/workspace-nav";
import { buildWorkspacePath } from "@/lib/workspace-query-params";

function ChatScreenInner() {
	const {
		selectedWorkspaceId,
		selectedProjectId,
		selectedProjectWorktree,
		selectedSessionId,
	} = useWorkspaceNav();

	const session = useSessionById(
		selectedWorkspaceId,
		selectedProjectWorktree,
		selectedSessionId,
	);
	const projectName = useProjectName(selectedProjectWorktree);

	const { messages, isLoading, isError } = useSessionMessages(
		selectedWorkspaceId,
		selectedSessionId,
	);

	const backHref = buildWorkspacePath({
		workspaceId: selectedWorkspaceId,
		projectId: selectedProjectId,
		worktree: selectedProjectWorktree,
	});

	return (
		<Container>
			<View className="flex-1 bg-background">
				<View className="border-border border-b px-4 py-3">
					<Link href={backHref} asChild>
						<Pressable
							className="focus-ring -ml-2 flex-row items-center gap-1 rounded-full px-2 py-2"
							style={{ minWidth: 44, minHeight: 44 }}
						>
							<Feather
								name="chevron-left"
								size={18}
								color="var(--color-icon)"
							/>
							<AppText className="text-foreground-weak text-sm">
								{projectName ?? "Sessions"}
							</AppText>
						</Pressable>
					</Link>
					<View className="mt-1 flex-row items-center justify-between">
						<AppText className="font-semibold text-foreground-strong text-xl">
							{session?.name ?? "Session"}
						</AppText>
						<Button size="sm" variant="outline">
							Share
						</Button>
					</View>
				</View>
				{selectedWorkspaceId && selectedSessionId ? (
					<>
						<ScrollView
							className="flex-1"
							contentContainerClassName="gap-3 p-4"
						>
							<MessageList
								messages={messages}
								isLoading={isLoading}
								autoScroll={false}
							/>
							{selectedSessionId && (
								<PermissionRequest sessionId={selectedSessionId} />
							)}
						</ScrollView>
						<ChatInput
							workspaceId={selectedWorkspaceId}
							sessionId={selectedSessionId}
							disabled={!selectedSessionId || isError}
						/>
					</>
				) : (
					<View className="flex-1 items-center justify-center">
						<AppText className="text-foreground-weak">
							No session selected
						</AppText>
					</View>
				)}
			</View>
		</Container>
	);
}

export default function WorkspaceChatScreen() {
	const { selectedWorkspaceId } = useWorkspaceNav();

	if (!selectedWorkspaceId) {
		return null;
	}

	return (
		<WorkspaceSDKProvider workspaceId={selectedWorkspaceId}>
			<ChatScreenInner />
		</WorkspaceSDKProvider>
	);
}
