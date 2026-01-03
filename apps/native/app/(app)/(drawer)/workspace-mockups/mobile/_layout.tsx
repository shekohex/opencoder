import { Stack } from "expo-router";

import { WorkspaceNavProvider } from "@/lib/workspace-nav";

export default function WorkspaceMockupsMobileLayout() {
	return (
		<WorkspaceNavProvider>
			<Stack screenOptions={{ headerShown: false }} />
		</WorkspaceNavProvider>
	);
}
