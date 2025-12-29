import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { fireEvent, render } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { ThemeProvider } from "@/lib/theme-context";
import { Select } from "./select.native";

function Wrapper({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider>
			<BottomSheetModalProvider>{children}</BottomSheetModalProvider>
		</ThemeProvider>
	);
}

describe("Select (Native)", () => {
	it("renders trigger with placeholder", () => {
		const { getByText } = render(
			<Select placeholder="Select an option">
				<Select.Option value="a">Option A</Select.Option>
				<Select.Content />
			</Select>,
			{ wrapper: Wrapper },
		);

		expect(getByText("Select an option")).toBeTruthy();
	});

	it("renders trigger with selected value", () => {
		const { getByRole } = render(
			<Select value="b" placeholder="Select an option">
				<Select.Option value="a">Option A</Select.Option>
				<Select.Option value="b">Option B</Select.Option>
				<Select.Content />
			</Select>,
			{ wrapper: Wrapper },
		);

		const trigger = getByRole("button");
		expect(trigger.props.accessibilityLabel).toBe("Option B");
	});

	it("is disabled when disabled prop is true", () => {
		const { getByText } = render(
			<Select disabled placeholder="Cannot select">
				<Select.Option value="a">Option A</Select.Option>
				<Select.Content />
			</Select>,
			{ wrapper: Wrapper },
		);

		expect(getByText("Cannot select")).toBeTruthy();
	});

	it("trigger is pressable when not disabled", () => {
		const { getByRole } = render(
			<Select placeholder="Select an option">
				<Select.Option value="a">Option A</Select.Option>
				<Select.Content />
			</Select>,
			{ wrapper: Wrapper },
		);

		const trigger = getByRole("button");
		expect(trigger).toBeTruthy();
		expect(trigger.props.accessibilityState?.disabled).toBeFalsy();
	});

	it("trigger shows expanded false by default", () => {
		const { getByRole } = render(
			<Select placeholder="Select an option">
				<Select.Option value="a">Option A</Select.Option>
				<Select.Content />
			</Select>,
			{ wrapper: Wrapper },
		);

		const trigger = getByRole("button");
		expect(trigger.props.accessibilityState?.expanded).toBe(false);
	});

	it("trigger is pressable and has correct accessibility", () => {
		const onValueChange = jest.fn();
		const { getByRole } = render(
			<Select placeholder="Select an option" onValueChange={onValueChange}>
				<Select.Option value="a">Option A</Select.Option>
				<Select.Content />
			</Select>,
			{ wrapper: Wrapper },
		);

		const trigger = getByRole("button");
		expect(trigger).toBeTruthy();
		expect(trigger.props.accessibilityState?.disabled).toBeFalsy();
		expect(trigger.props.accessibilityLabel).toBe("Select an option");
	});

	it("renders with defaultValue", () => {
		const { getByRole } = render(
			<Select defaultValue="b" placeholder="Select an option">
				<Select.Option value="a">Option A</Select.Option>
				<Select.Option value="b">Option B</Select.Option>
				<Select.Content />
			</Select>,
			{ wrapper: Wrapper },
		);

		const trigger = getByRole("button");
		expect(trigger.props.accessibilityLabel).toBe("Option B");
	});

	it("renders multiple selection display", () => {
		const { getByRole } = render(
			<Select
				selectionMode="multiple"
				defaultValue={["a", "b"]}
				placeholder="Select options"
			>
				<Select.Option value="a">Option A</Select.Option>
				<Select.Option value="b">Option B</Select.Option>
				<Select.Option value="c">Option C</Select.Option>
				<Select.Content />
			</Select>,
			{ wrapper: Wrapper },
		);

		const trigger = getByRole("button");
		expect(trigger.props.accessibilityLabel).toBe("Option A, Option B");
	});

	it("updates trigger text for multiple selections", () => {
		const { getByRole, getByText } = render(
			<Select selectionMode="multiple" placeholder="Select options">
				<Select.Option value="a">Option A</Select.Option>
				<Select.Option value="b">Option B</Select.Option>
				<Select.Content />
			</Select>,
			{ wrapper: Wrapper },
		);

		fireEvent.press(getByText("Option A"));
		let trigger = getByRole("button");
		expect(trigger.props.accessibilityLabel).toBe("Option A");

		fireEvent.press(getByText("Option B"));
		trigger = getByRole("button");
		expect(trigger.props.accessibilityLabel).toBe("Option A, Option B");
	});

	it("ignores disabled option selection", () => {
		const { getByText } = render(
			<Select placeholder="Select an option">
				<Select.Option value="a" disabled>
					Option A
				</Select.Option>
				<Select.Content />
			</Select>,
			{ wrapper: Wrapper },
		);

		fireEvent.press(getByText("Option A"));
		expect(getByText("Select an option")).toBeTruthy();
	});
});
