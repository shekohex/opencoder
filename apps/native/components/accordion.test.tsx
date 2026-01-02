import { fireEvent, render } from "@testing-library/react-native";
import { useState } from "react";
import { Text } from "react-native";

import { Accordion } from "./accordion";

describe("Accordion", () => {
	function ControlledAccordion() {
		const [value, setValue] = useState<string | string[]>("one");
		return (
			<Accordion type="single" value={value} onValueChange={setValue}>
				<Accordion.Item value="one">
					<Accordion.Trigger>
						<Text>Item One</Text>
					</Accordion.Trigger>
					<Accordion.Content>
						<Text>Content One</Text>
					</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="two">
					<Accordion.Trigger>
						<Text>Item Two</Text>
					</Accordion.Trigger>
					<Accordion.Content>
						<Text>Content Two</Text>
					</Accordion.Content>
				</Accordion.Item>
			</Accordion>
		);
	}

	it("toggles single item when collapsible", () => {
		const { getByText, queryByText } = render(
			<Accordion type="single" collapsible>
				<Accordion.Item value="one">
					<Accordion.Trigger>
						<Text>Item One</Text>
					</Accordion.Trigger>
					<Accordion.Content>
						<Text>Content One</Text>
					</Accordion.Content>
				</Accordion.Item>
			</Accordion>,
		);

		expect(queryByText("Content One")).toBeNull();
		fireEvent.press(getByText("Item One"));
		expect(getByText("Content One")).toBeTruthy();
		fireEvent.press(getByText("Item One"));
		expect(queryByText("Content One")).toBeNull();
	});

	it("keeps item open when not collapsible", () => {
		const { getByText } = render(
			<Accordion type="single" collapsible={false}>
				<Accordion.Item value="one">
					<Accordion.Trigger>
						<Text>Item One</Text>
					</Accordion.Trigger>
					<Accordion.Content>
						<Text>Content One</Text>
					</Accordion.Content>
				</Accordion.Item>
			</Accordion>,
		);

		fireEvent.press(getByText("Item One"));
		expect(getByText("Content One")).toBeTruthy();
		fireEvent.press(getByText("Item One"));
		expect(getByText("Content One")).toBeTruthy();
	});

	it("calls onValueChange with collapsed value", () => {
		const onValueChange = jest.fn();
		const { getByText } = render(
			<Accordion type="single" collapsible onValueChange={onValueChange}>
				<Accordion.Item value="one">
					<Accordion.Trigger>
						<Text>Item One</Text>
					</Accordion.Trigger>
					<Accordion.Content>
						<Text>Content One</Text>
					</Accordion.Content>
				</Accordion.Item>
			</Accordion>,
		);

		fireEvent.press(getByText("Item One"));
		expect(onValueChange).toHaveBeenLastCalledWith("one");
		fireEvent.press(getByText("Item One"));
		expect(onValueChange).toHaveBeenLastCalledWith("");
	});

	it("supports multiple expanded items", () => {
		const { getByText } = render(
			<Accordion type="multiple">
				<Accordion.Item value="one">
					<Accordion.Trigger>
						<Text>Item One</Text>
					</Accordion.Trigger>
					<Accordion.Content>
						<Text>Content One</Text>
					</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="two">
					<Accordion.Trigger>
						<Text>Item Two</Text>
					</Accordion.Trigger>
					<Accordion.Content>
						<Text>Content Two</Text>
					</Accordion.Content>
				</Accordion.Item>
			</Accordion>,
		);

		fireEvent.press(getByText("Item One"));
		fireEvent.press(getByText("Item Two"));
		expect(getByText("Content One")).toBeTruthy();
		expect(getByText("Content Two")).toBeTruthy();
	});

	it("supports controlled value", () => {
		const { getByText, queryByText } = render(<ControlledAccordion />);

		expect(getByText("Content One")).toBeTruthy();
		expect(queryByText("Content Two")).toBeNull();
		fireEvent.press(getByText("Item Two"));
		expect(getByText("Content Two")).toBeTruthy();
		expect(queryByText("Content One")).toBeNull();
	});

	it("ignores toggles when root is disabled", () => {
		const { getByText, queryByText } = render(
			<Accordion disabled>
				<Accordion.Item value="one">
					<Accordion.Trigger>
						<Text>Item One</Text>
					</Accordion.Trigger>
					<Accordion.Content>
						<Text>Content One</Text>
					</Accordion.Content>
				</Accordion.Item>
			</Accordion>,
		);

		fireEvent.press(getByText("Item One"));
		expect(queryByText("Content One")).toBeNull();
	});

	it("respects disabled items", () => {
		const { getByText, queryByText } = render(
			<Accordion type="single" collapsible>
				<Accordion.Item value="one" isDisabled>
					<Accordion.Trigger>
						<Text>Item One</Text>
					</Accordion.Trigger>
					<Accordion.Content>
						<Text>Content One</Text>
					</Accordion.Content>
				</Accordion.Item>
			</Accordion>,
		);

		fireEvent.press(getByText("Item One"));
		expect(queryByText("Content One")).toBeNull();
	});
});
