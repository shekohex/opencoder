jest.mock("react-native-nitro-modules", () => {
	return {
		createHybridObject: jest.fn(() => {
			return {};
		}),
	};
});

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
