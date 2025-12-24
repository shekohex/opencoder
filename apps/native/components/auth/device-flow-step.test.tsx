import { beforeEach, describe, expect, it, jest } from "bun:test";
import { API } from "@coder/sdk";
import { fireEvent, render } from "@testing-library/react-native";
import * as Clipboard from "expo-clipboard";
import { Linking } from "react-native";
import { SessionProvider } from "@/lib/auth";
import { DeviceFlowStep } from "./device-flow-step";

// Mock dependencies
jest.mock("@coder/sdk", () => ({
	API: {
		getExternalAuthDevice: jest.fn(),
		exchangeExternalAuthDevice: jest.fn(),
		setSessionToken: jest.fn(),
	},
}));

jest.mock("expo-clipboard", () => ({
	setStringAsync: jest.fn(),
}));

jest.mock("react-native/Libraries/Linking/Linking", () => ({
	openURL: jest.fn(),
}));

describe("DeviceFlowStep", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("starts device flow and shows code", async () => {
		(API.getExternalAuthDevice as jest.Mock).mockResolvedValue({
			user_code: "ABCD-1234",
			verification_uri: "https://github.com/login/device",
			device_code: "device-code-123",
			expires_in: 900,
			interval: 5,
		});

		const { findByText } = render(
			<SessionProvider>
				<DeviceFlowStep
					provider="github"
					providerName="GitHub"
					onAuthenticated={jest.fn()}
					onCancel={jest.fn()}
				/>
			</SessionProvider>,
		);

		expect(await findByText("ABCD-1234")).toBeTruthy();
		expect(API.getExternalAuthDevice).toHaveBeenCalledWith("github");
	});

	it("copies code to clipboard", async () => {
		(API.getExternalAuthDevice as jest.Mock).mockResolvedValue({
			user_code: "ABCD-1234",
			verification_uri: "https://github.com/login/device",
			device_code: "device-code-123",
			expires_in: 900,
			interval: 5,
		});

		const { findByText, getByLabelText } = render(
			<SessionProvider>
				<DeviceFlowStep
					provider="github"
					providerName="GitHub"
					onAuthenticated={jest.fn()}
					onCancel={jest.fn()}
				/>
			</SessionProvider>,
		);

		await findByText("ABCD-1234");

		// Assuming we have a copy button or pressable
		const copyButton = getByLabelText("Copy code");
		fireEvent.press(copyButton);

		expect(Clipboard.setStringAsync).toHaveBeenCalledWith("ABCD-1234");
	});

	it("opens link", async () => {
		(API.getExternalAuthDevice as jest.Mock).mockResolvedValue({
			user_code: "ABCD-1234",
			verification_uri: "https://github.com/login/device",
			device_code: "device-code-123",
			expires_in: 900,
			interval: 5,
		});

		const { findByText } = render(
			<SessionProvider>
				<DeviceFlowStep
					provider="github"
					providerName="GitHub"
					onAuthenticated={jest.fn()}
					onCancel={jest.fn()}
				/>
			</SessionProvider>,
		);

		await findByText("ABCD-1234");

		const openButton = await findByText("Open and Paste");
		fireEvent.press(openButton);

		expect(Linking.openURL).toHaveBeenCalledWith(
			"https://github.com/login/device",
		);
	});
});
