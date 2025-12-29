import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { act, fireEvent, render } from "@testing-library/react-native";
import type React from "react";
import { Alert, Text } from "react-native";

import { ThemeProvider } from "@/lib/theme-context";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./dialog.native";

function Wrapper({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider>
			<BottomSheetModalProvider>{children}</BottomSheetModalProvider>
		</ThemeProvider>
	);
}

describe("Dialog (Native)", () => {
	let alertSpy: jest.SpyInstance;

	beforeEach(() => {
		jest.useFakeTimers();
		alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
	});

	afterEach(() => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
		jest.restoreAllMocks();
	});

	it("uses alert buttons from DialogClose", () => {
		const { getByText } = render(
			<Dialog variant="alert">
				<DialogTrigger>
					<Text>Open</Text>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm</DialogTitle>
						<DialogDescription>Are you sure?</DialogDescription>
					</DialogHeader>
					<DialogClose style="cancel">Cancel</DialogClose>
					<DialogClose style="destructive">Yes</DialogClose>
				</DialogContent>
			</Dialog>,
			{ wrapper: Wrapper },
		);

		fireEvent.press(getByText("Open"));
		act(() => {
			jest.runAllTimers();
		});

		expect(alertSpy).toHaveBeenCalledTimes(1);
		const [, , buttons] = alertSpy.mock.calls[0];
		expect(buttons).toHaveLength(2);
		expect(buttons[0].text).toBe("Cancel");
		expect(buttons[1].text).toBe("Yes");
	});

	it("falls back to OK when no DialogClose exists", () => {
		const { getByText } = render(
			<Dialog variant="alert">
				<DialogTrigger>
					<Text>Open</Text>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Heads up</DialogTitle>
						<DialogDescription>Read this carefully.</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>,
			{ wrapper: Wrapper },
		);

		fireEvent.press(getByText("Open"));
		act(() => {
			jest.advanceTimersByTime(60);
		});

		expect(alertSpy).toHaveBeenCalledTimes(1);
		const [, , buttons] = alertSpy.mock.calls[0];
		expect(buttons).toHaveLength(1);
		expect(buttons[0].text).toBe("OK");
	});
});
