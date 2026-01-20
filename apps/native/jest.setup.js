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
	return {
		Ionicons: Icon,
		default: Icon,
	};
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

jest.mock("expo-secure-store", () => ({
	getItemAsync: jest.fn(),
	setItemAsync: jest.fn(),
	deleteItemAsync: jest.fn(),
}));

jest.mock("expo-clipboard", () => ({
	getStringAsync: jest.fn(),
	setStringAsync: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
	...jest.requireActual("@react-navigation/native"),
	useNavigation: () => ({
		navigate: jest.fn(),
		goBack: jest.fn(),
		push: jest.fn(),
		reset: jest.fn(),
		setParams: jest.fn(),
		dispatch: jest.fn(),
	}),
	NavigationContainer: ({ children }) => children,
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

jest.mock("react-native/Libraries/TurboModule/TurboModuleRegistry", () => ({
	getEnforcing: jest.fn(() => ({})),
	get: jest.fn(() => ({})),
}));

jest.mock("@/lib/font-registry", () => ({
	getFontFamily: jest.fn(() => "System"),
	SANS_FONTS: { Inter: "Inter" },
	MONO_FONTS: { IBMPlexMono: "IBMPlexMono" },
}));

jest.mock("@/lib/font-context", () => ({
	useFontsConfig: () => ({
		sansSet: "Inter",
		monoSet: "IBMPlexMono",
		monoFlavor: "normal",
		isNerdEnabled: false,
		resolveFont: jest.fn(() => "System"),
		setSansSet: jest.fn(),
		setMonoSet: jest.fn(),
		setMonoFlavor: jest.fn(),
	}),
	FontProvider: ({ children }) => children,
}));

jest.mock("@/lib/opencode-provider", () => ({
	useGlobalOpenCode: () => ({
		connections: new Map(),
		connect: jest.fn(),
		disconnect: jest.fn(),
		getClient: jest.fn(() => ({
			session: {
				prompt: jest.fn(),
				create: jest.fn(),
			},
		})),
		getConnection: jest.fn(),
		hasConnection: jest.fn(),
		isConnecting: jest.fn(),
		event: {
			on: jest.fn(() => jest.fn()),
			emit: jest.fn(),
			listen: jest.fn(() => jest.fn()),
		},
	}),
	GlobalOpenCodeProvider: ({ children }) => children,
}));

jest.mock("@/lib/chat/chat-mutations", () => ({
	useChatMutations: jest.fn(() => ({
		sendMessage: {
			mutate: jest.fn(),
			isPending: false,
		},
		createSession: {
			mutate: jest.fn(),
			isPending: false,
		},
	})),
}));

jest.mock("react-native", () => {
	const React = require("react");
	const {
		View: ReactView,
		Text: ReactText,
		Pressable: ReactPressable,
	} = jest.requireActual("react-native");

	const ActivityIndicator = (props) => {
		const { testID = "activity-indicator", ...rest } = props;
		return React.createElement(ReactView, { ...rest, testID });
	};

	return {
		View: ReactView,
		Text: ReactText,
		Pressable: ReactPressable,
		ActivityIndicator,
		ScrollView: ({ children, ...props }) =>
			React.createElement(ReactView, props, children),
		FlatList: ({ data, renderItem, ...props }) =>
			React.createElement(
				ReactView,
				props,
				data?.map((item, i) => renderItem({ item, index: i })),
			),
		StyleSheet: { create: (styles) => styles, flatten: (styles) => styles },
		Platform: { OS: "ios", select: (opts) => opts.ios || opts.default },
		useColorScheme: () => "light",
		useWindowDimensions: () => ({ width: 390, height: 844 }),
	};
});
