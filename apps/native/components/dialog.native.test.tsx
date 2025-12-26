import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Alert, Pressable, Text } from "react-native";
import { Dialog } from "./dialog.native";

jest.mock("react-native/Libraries/Alert/Alert", () => ({
	alert: jest.fn(),
}));

describe("Dialog (Native)", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders trigger children", () => {
		const { getByText } = render(
			<Dialog>
				<Dialog.Trigger asChild>
					<Pressable>
						<Text>Open Dialog</Text>
					</Pressable>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Title>Test Title</Dialog.Title>
					<Dialog.Description>Test Description</Dialog.Description>
					<Dialog.Footer>
						<Dialog.Close asChild>
							<Pressable>
								<Text>Cancel</Text>
							</Pressable>
						</Dialog.Close>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog>,
		);

		expect(getByText("Open Dialog")).toBeTruthy();
	});

	it("shows Alert when trigger pressed", async () => {
		const { getByText } = render(
			<Dialog>
				<Dialog.Trigger asChild>
					<Pressable>
						<Text>Open Dialog</Text>
					</Pressable>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Title>Test Title</Dialog.Title>
					<Dialog.Description>Test Description</Dialog.Description>
					<Dialog.Footer>
						<Dialog.Close asChild>
							<Pressable>
								<Text>Cancel</Text>
							</Pressable>
						</Dialog.Close>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog>,
		);

		fireEvent.press(getByText("Open Dialog"));

		await waitFor(() => {
			expect(Alert.alert).toHaveBeenCalledWith(
				"Test Title",
				"Test Description",
				expect.arrayContaining([expect.objectContaining({ text: "Cancel" })]),
				{ cancelable: true },
			);
		});
	});

	it("shows default OK button when no close button provided", async () => {
		const { getByText } = render(
			<Dialog>
				<Dialog.Trigger asChild>
					<Pressable>
						<Text>Open Dialog</Text>
					</Pressable>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Title>Title</Dialog.Title>
				</Dialog.Content>
			</Dialog>,
		);

		fireEvent.press(getByText("Open Dialog"));

		await waitFor(() => {
			expect(Alert.alert).toHaveBeenCalledWith(
				"Title",
				undefined,
				expect.arrayContaining([expect.objectContaining({ text: "OK" })]),
				expect.any(Object),
			);
		});
	});

	it("calls onOpenChange when dialog closes", async () => {
		const onOpenChange = jest.fn();
		const { getByText } = render(
			<Dialog onOpenChange={onOpenChange}>
				<Dialog.Trigger asChild>
					<Pressable>
						<Text>Open Dialog</Text>
					</Pressable>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Title>Title</Dialog.Title>
					<Dialog.Footer>
						<Dialog.Close asChild>
							<Pressable>
								<Text>Cancel</Text>
							</Pressable>
						</Dialog.Close>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog>,
		);

		fireEvent.press(getByText("Open Dialog"));

		await waitFor(() => {
			expect(onOpenChange).toHaveBeenCalledWith(true);
		});

		const alertCalls = (Alert.alert as jest.Mock).mock.calls;
		const buttons = alertCalls[0][2] as Array<{ onPress: () => void }>;
		buttons[0].onPress();

		expect(onOpenChange).toHaveBeenCalledWith(false);
	});
});
