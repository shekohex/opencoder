import { Stack } from "expo-router";
import { useWindowDimensions } from "react-native";
import { DesktopShell } from "@/components/sidebar";
import { breakpoints } from "@/lib/tokens";
import { WorkspaceNavProvider } from "@/lib/workspace-nav";

export default function WorkspacesLayout() {
	const { width } = useWindowDimensions();
	const isDesktop = width >= breakpoints.md;

	return (
		<WorkspaceNavProvider>
			{isDesktop ? (
				<DesktopShell>
					<Stack screenOptions={{ headerShown: false }} />
				</DesktopShell>
			) : (
				<Stack screenOptions={{ headerShown: false }} />
			)}
		</WorkspaceNavProvider>
	);
}
