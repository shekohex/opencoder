module.exports = {
	preset: "jest-expo",
	rootDir: ".",
	transformIgnorePatterns: [
		"node_modules/(?!((?:\\.bun/.+?/node_modules/)?((jest-)?react-native|@react-native(-community)?|@react-native/.*|expo(nent)?|expo-modules-core|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|uniwind|@opencoder/branding|nuqs)))",
	],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/$1",
	},
	setupFiles: ["<rootDir>/jest.pre-setup.js"],
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
	testMatch: [
		"<rootDir>/tests/**/*.test.tsx",
		"<rootDir>/lib/**/*.test.tsx",
		"<rootDir>/components/**/*.test.tsx",
		"<rootDir>/app/**/*.test.ts",
		"<rootDir>/domain/**/*.test.ts",
	],
};
