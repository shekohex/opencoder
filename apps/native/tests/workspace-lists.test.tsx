import { fireEvent, render } from "@testing-library/react-native";
import type React from "react";

import WorkspacesProjectsScreen from "@/app/(app)/(drawer)/workspaces/projects";
import WorkspacesSessionsScreen from "@/app/(app)/(drawer)/workspaces/sessions";
import { FontProvider } from "@/lib/font-context";
import { ThemeProvider } from "@/lib/theme-context";
import { WorkspaceNavProvider } from "@/lib/workspace-nav";

const createWrapper = () => {
	return ({ children }: { children: React.ReactNode }) => (
		<ThemeProvider>
			<FontProvider>
				<WorkspaceNavProvider>{children}</WorkspaceNavProvider>
			</FontProvider>
		</ThemeProvider>
	);
};

describe("Workspace lists", () => {
	it("scrolls the projects list", () => {
		const { getByTestId } = render(<WorkspacesProjectsScreen />, {
			wrapper: createWrapper(),
		});

		const list = getByTestId("projects-list");
		fireEvent.scroll(list, {
			nativeEvent: {
				contentOffset: { y: 200 },
				layoutMeasurement: { height: 400, width: 300 },
				contentSize: { height: 800, width: 300 },
			},
		});
		expect(list).toBeTruthy();
	});

	it("scrolls the sessions list", () => {
		const { getByTestId } = render(<WorkspacesSessionsScreen />, {
			wrapper: createWrapper(),
		});

		const list = getByTestId("sessions-list");
		fireEvent.scroll(list, {
			nativeEvent: {
				contentOffset: { y: 200 },
				layoutMeasurement: { height: 400, width: 300 },
				contentSize: { height: 800, width: 300 },
			},
		});
		expect(list).toBeTruthy();
	});
});
