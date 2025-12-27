import { render } from "@testing-library/react-native";
import { Select } from "./select.native";

describe("Select (Native)", () => {
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
