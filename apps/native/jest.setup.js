const _React = require("react");

// Mock @opencoder/branding to avoid loading react-native-svg in tests
jest.mock("@opencoder/branding", () => {
	const React = require("react");
	return {
		Logo: (props) => React.createElement("Logo", props),
		Icon: (props) => React.createElement("Icon", props),
		brandColors: {
			light: {
				open: "#888888",
				coder: "#000000",
				outer: "#000000",
				inner: "#FFFFFF",
			},
			dark: {
				open: "#BBBBBB",
				coder: "#FFFFFF",
				outer: "#FFFFFF",
				inner: "#000000",
			},
		},
		fonts: {
			turretRoad: "Turret Road",
			inter: "Inter",
			jetbrainsMono: "JetBrains Mono",
		},
	};
});

jest.mock("react-native-nitro-modules", () => ({
	createHybridObject: jest.fn(() => ({})),
}));

jest.mock("@expo/vector-icons", () => {
	const React = require("react");
	const Icon = (props) => React.createElement("Icon", props);
	return new Proxy({}, { get: () => Icon });
});

jest.mock("@gorhom/bottom-sheet", () => {
	const React = require("react");
	const { View } = require("react-native");
	const BottomSheetModalProvider = ({ children }) => children;
	const BottomSheetView = ({ children, ...props }) =>
		React.createElement(View, props, children);
	const BottomSheetModal = React.forwardRef(({ children, ...props }, ref) => {
		React.useImperativeHandle(ref, () => ({
			present: () => {},
			dismiss: () => {},
		}));
		return React.createElement(View, props, children);
	});
	return {
		BottomSheetModalProvider,
		BottomSheetModal,
		BottomSheetView,
	};
});

jest.mock("uniwind", () => ({
	Uniwind: {
		setTheme: jest.fn(),
		updateCSSVariables: jest.fn(),
	},
}));

jest.mock("expo-router", () => ({
	useRouter: () => ({
		push: jest.fn(),
		replace: jest.fn(),
		back: jest.fn(),
	}),
	useLocalSearchParams: () => ({}),
	useSegments: () => [],
	usePathname: () => "/",
	router: {
		push: jest.fn(),
		replace: jest.fn(),
		back: jest.fn(),
	},
	Redirect: () => null,
	Link: ({ children }) => children,
	Stack: {
		Screen: () => null,
	},
}));

jest.mock("react-native", () => {
	const RN = jest.requireActual("react-native");
	return {
		...RN,
		Platform: {
			OS: "ios",
		},
	};
});
