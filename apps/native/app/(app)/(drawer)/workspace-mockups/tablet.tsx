import { View } from "react-native";

import { Container } from "@/components/container";
import { WorkspaceThreePane } from "@/components/workspace-mockups/shared";
import { useWorkspaceLayout } from "@/lib/hooks/use-workspace-layout";

export default function WorkspaceMockupsTablet() {
	const { width, height, isPortrait } = useWorkspaceLayout();

	return (
		<Container>
			<View className="flex-1 bg-background">
				<WorkspaceThreePane
					breakpoint="tablet"
					showRightPanel={!isPortrait}
					availableWidth={width}
					height={height}
					isFramed={false}
				/>
			</View>
		</Container>
	);
}
