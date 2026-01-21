import { useMemo } from "react";
import { View } from "react-native";

import { Container } from "@/components/container";
import {
	ChatPanel,
	InfoSidebar,
	RIGHT_PANEL_WIDTH,
} from "@/components/workspace-list/shared";
import { useWorkspaceLayout } from "@/lib/hooks/use-workspace-layout";
import { useOpenCodeSessions } from "@/lib/session-queries";
import { breakpoints } from "@/lib/tokens";
import { useDocumentTitle } from "@/lib/use-document-title";
import { useWorkspaceNav } from "@/lib/workspace-nav";
import { useWorkspaces } from "@/lib/workspace-queries";
import MobileChatScreen from "./mobile";

export default function WorkspaceChatScreen() {
	const { width } = useWorkspaceLayout();

	if (width < breakpoints.md) {
		return <MobileChatScreen />;
	}

	return <DesktopChatScreen />;
}

function DesktopChatScreen() {
	const { width } = useWorkspaceLayout();
	const showRightPanel = width >= breakpoints.xl;
	const { selectedWorkspaceId, selectedProjectWorktree, selectedSessionId } =
		useWorkspaceNav();
	const { sessions } = useOpenCodeSessions(
		selectedWorkspaceId,
		selectedProjectWorktree ?? undefined,
	);
	const { data: workspaces } = useWorkspaces();

	const workspaceName = useMemo(() => {
		if (!workspaces || !selectedWorkspaceId) return null;
		return workspaces.find((w) => w.id === selectedWorkspaceId)?.name ?? null;
	}, [workspaces, selectedWorkspaceId]);

	const projectName = useMemo(() => {
		if (!selectedProjectWorktree) return null;
		return selectedProjectWorktree.split("/").pop() ?? null;
	}, [selectedProjectWorktree]);

	const sessionName = useMemo(() => {
		if (!sessions || !selectedSessionId) return null;
		return sessions.find((s) => s.id === selectedSessionId)?.name ?? null;
	}, [sessions, selectedSessionId]);

	useDocumentTitle({
		session: sessionName,
		project: projectName,
		workspace: workspaceName,
	});

	return (
		<Container>
			<View className="flex-1 flex-row bg-background">
				<ChatPanel
					sessionTitle={sessionName ?? undefined}
					messageState="ready"
				/>
				{showRightPanel && (
					<InfoSidebar width={RIGHT_PANEL_WIDTH} sessions={sessions} />
				)}
			</View>
		</Container>
	);
}
