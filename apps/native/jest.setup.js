jest.mock("react-native-nitro-modules", () => {
	return {
		createHybridObject: jest.fn(() => {
			return {};
		}),
	};
});
