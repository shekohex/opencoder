import { act, fireEvent, render } from "@testing-library/react-native";
import * as ReactNative from "react-native";
import { Pressable, Text, View } from "react-native";
import { Uniwind } from "uniwind";
import { ThemeProvider, useTheme } from "./theme-context";

jest.mock("react-native-mmkv", () => {
	const store = new Map<string, string>();
	return {
		createMMKV: jest.fn(() => ({
			getString: (key: string) => store.get(key),
			set: (key: string, value: string) => {
				store.set(key, value);
			},
		})),
	};
});

function ThemeProbe() {
	const { themeVersion, setThemeName, setModePreference } = useTheme();

	return (
		<View>
			<Text testID="themeVersion">{String(themeVersion)}</Text>
			<Pressable testID="setTheme" onPress={() => setThemeName("opencode")} />
			<Pressable testID="setMode" onPress={() => setModePreference("dark")} />
		</View>
	);
}

describe("ThemeProvider", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.spyOn(ReactNative, "useColorScheme").mockReturnValue("light");
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("bumps theme version and invalidates variables on change", async () => {
		const expectedRadii = {
			"--radius-xs": "2px",
			"--radius-sm": "4px",
			"--radius-md": "6px",
			"--radius-lg": "8px",
			"--radius-xl": "10px",
		};
		const { getByTestId } = render(
			<ThemeProvider>
				<ThemeProbe />
			</ThemeProvider>,
		);

		await act(async () => {});

		expect(getByTestId("themeVersion").props.children).toBe("1");
		expect(Uniwind.setTheme).toHaveBeenCalledWith("light");
		expect(Uniwind.updateCSSVariables).toHaveBeenCalledWith(
			"light",
			expectedRadii,
		);

		await act(async () => {
			fireEvent.press(getByTestId("setTheme"));
		});

		expect(getByTestId("themeVersion").props.children).toBe("2");
		expect(Uniwind.setTheme).toHaveBeenCalledWith("opencode-light");
		expect(Uniwind.updateCSSVariables).toHaveBeenCalledWith(
			"opencode-light",
			expectedRadii,
		);

		await act(async () => {
			fireEvent.press(getByTestId("setMode"));
		});

		expect(getByTestId("themeVersion").props.children).toBe("3");
		expect(Uniwind.setTheme).toHaveBeenCalledWith("opencode-dark");
		expect(Uniwind.updateCSSVariables).toHaveBeenCalledWith(
			"opencode-dark",
			expectedRadii,
		);
	});
});
