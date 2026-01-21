import { Container } from "@/components/container";
import { useWorkspacePolling } from "@/components/workspace-list/shared";
import { MobileWorkspaces } from "./mobile";

export default function WorkspacesScreen() {
	const { workspaceGroups, hasActiveBuilds, isLoading, isError } =
		useWorkspacePolling();

	const getListState = () => {
		if (isLoading) return "loading" as const;
		if (isError) return "error" as const;
		if (workspaceGroups.length === 0) return "empty" as const;
		return "ready" as const;
	};

	return (
		<Container>
			<MobileWorkspaces
				workspaceGroups={workspaceGroups}
				hasActiveBuilds={hasActiveBuilds}
				listState={getListState()}
			/>
		</Container>
	);
}
