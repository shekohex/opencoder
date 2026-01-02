import { Stack } from "expo-router";
import { WorkspaceNavProvider } from "@/lib/workspace-nav";

export default function WorkspacesLayout() {
	return (
		<WorkspaceNavProvider>
			<Stack screenOptions={{ headerShown: false }} />
		</WorkspaceNavProvider>
	);
}
