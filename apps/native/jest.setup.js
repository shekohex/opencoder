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

jest.mock("uniwind", () => ({
	Uniwind: {
		setTheme: jest.fn(),
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
	Stack: {
		Screen: () => null,
	},
}));
