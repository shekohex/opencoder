import { useMemo } from "react";
import { View } from "react-native";

import { Container } from "@/components/container";
import {
	ChatPanel,
	InfoSidebar,
	type ListState,
	RIGHT_PANEL_WIDTH,
	useWorkspacePolling,
} from "@/components/workspace-mockups/shared";
import { useWorkspaceLayout } from "@/lib/hooks/use-workspace-layout";
import { useOpenCodeSessions } from "@/lib/session-queries";
import { breakpoints } from "@/lib/tokens";
import { useDocumentTitle } from "@/lib/use-document-title";
import { useWorkspaceNav } from "@/lib/workspace-nav";
import { useWorkspaces } from "@/lib/workspace-queries";

export default function WorkspacesScreen() {
	const { width } = useWorkspaceLayout();
	const { isLoading, isError } = useWorkspacePolling();

	const getListState = (): ListState => {
		if (isLoading) return "loading";
		if (isError) return "error";
		return "ready";
	};

	const showRightPanel = width >= breakpoints.xl;

	return (
		<Container>
			<DesktopContent
				showRightPanel={showRightPanel}
				listState={getListState()}
			/>
		</Container>
	);
}

function DesktopContent({
	showRightPanel,
	listState,
}: {
	showRightPanel: boolean;
	listState: ListState;
}) {
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
		<View className="flex-1 flex-row bg-background">
			<ChatPanel
				sessionTitle={sessionName ?? undefined}
				messageState={listState}
			/>
			{showRightPanel && (
				<InfoSidebar width={RIGHT_PANEL_WIDTH} sessions={sessions} />
			)}
		</View>
	);
}
