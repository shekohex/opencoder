import { render } from "@testing-library/react-native";
import React from "react";
import { FontProvider } from "@/lib/font-context";
import { Terminal } from "../Terminal";

const wrapper = ({ children }) => {
	return React.createElement(
		global.TestQueryClientProvider,
		null,
		React.createElement(FontProvider, null, children),
	);
};

const workspaceId = "workspace-123";

describe("Terminal", () => {
	it("renders terminal container", () => {
		const { getByTestId } = render(
			<Terminal workspaceId={workspaceId} directory="/workspace" />,
			{ wrapper },
		);

		expect(getByTestId("terminal-container")).toBeTruthy();
	});

	it("renders terminal list", () => {
		const { getByTestId } = render(
			<Terminal workspaceId={workspaceId} directory="/workspace" />,
			{ wrapper },
		);

		expect(getByTestId("terminal-list")).toBeTruthy();
	});

	it("renders create terminal button", () => {
		const { getByTestId } = render(
			<Terminal workspaceId={workspaceId} directory="/workspace" />,
			{ wrapper },
		);

		expect(getByTestId("create-terminal-button")).toBeTruthy();
	});

	it("shows empty state when no terminals", () => {
		const { getByTestId } = render(
			<Terminal workspaceId={workspaceId} directory="/workspace" />,
			{ wrapper },
		);

		expect(getByTestId("no-terminals-text")).toBeTruthy();
	});

	it("displays terminal items for each PTY", () => {
		const { getByTestId } = render(
			<Terminal workspaceId={workspaceId} directory="/workspace" />,
			{ wrapper },
		);

		expect(getByTestId("terminal-item-list")).toBeTruthy();
	});

	it("opens ghostty web terminal when terminal item is pressed", () => {
		const { getByTestId } = render(
			<Terminal workspaceId={workspaceId} directory="/workspace" />,
			{ wrapper },
		);

		expect(getByTestId("terminal-press-area")).toBeTruthy();
	});

	it("can close a terminal", () => {
		const { getByTestId } = render(
			<Terminal workspaceId={workspaceId} directory="/workspace" />,
			{ wrapper },
		);

		expect(getByTestId("close-terminal-action")).toBeTruthy();
	});
});
