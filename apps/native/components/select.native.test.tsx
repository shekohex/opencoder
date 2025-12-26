import { fireEvent, render } from "@testing-library/react-native";
import { Select } from "./select.native";

jest.mock("@expo/react-native-action-sheet", () => ({
	useActionSheet: () => ({
		showActionSheetWithOptions: jest.fn(),
	}),
}));

describe("Select (Native)", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders trigger with placeholder", () => {
		const { getByText } = render(
			<Select placeholder="Select an option">
				<Select.Option value="a">Option A</Select.Option>
				<Select.Content />
			</Select>,
		);

		expect(getByText("Select an option")).toBeTruthy();
	});

	it("renders trigger with selected value", () => {
		const { getByText } = render(
			<Select value="b" placeholder="Select an option">
				<Select.Option value="a">Option A</Select.Option>
				<Select.Option value="b">Option B</Select.Option>
				<Select.Content />
			</Select>,
		);

		expect(getByText("Option B")).toBeTruthy();
	});

	it("shows action sheet when trigger pressed", () => {
		const { useActionSheet } = require("@expo/react-native-action-sheet");
		const showActionSheet = useActionSheet().showActionSheetWithOptions;
		const { getByText } = render(
			<Select placeholder="Select an option" label="Choose Theme">
				<Select.Option value="light">Light</Select.Option>
				<Select.Option value="dark">Dark</Select.Option>
				<Select.Content />
			</Select>,
		);

		fireEvent.press(getByText("Select an option"));

		expect(showActionSheet).toHaveBeenCalledWith(
			expect.objectContaining({
				options: expect.arrayContaining(["Light", "Dark", "Cancel"]),
				cancelButtonIndex: 2,
				title: "Choose Theme",
			}),
			expect.any(Function),
		);
	});

	it("calls onValueChange when option selected", () => {
		const { useActionSheet } = require("@expo/react-native-action-sheet");
		const showActionSheet = useActionSheet().showActionSheetWithOptions;
		const onValueChange = jest.fn();

		const { getByPlaceholderText } = render(
			<Select placeholder="Select an option" onValueChange={onValueChange}>
				<Select.Option value="light">Light</Select.Option>
				<Select.Option value="dark">Dark</Select.Option>
				<Select.Content />
			</Select>,
		);

		fireEvent.press(getByPlaceholderText("Select an option"));

		const callback = (showActionSheet as jest.Mock).mock.calls[0][1];
		callback(0);

		expect(onValueChange).toHaveBeenCalledWith("light");
	});

	it("is disabled when disabled prop is true", () => {
		const { getByText } = render(
			<Select disabled placeholder="Cannot select">
				<Select.Option value="a">Option A</Select.Option>
				<Select.Content />
			</Select>,
		);

		expect(getByText("Cannot select")).toBeTruthy();
	});
});
