module.exports = {
	preset: "jest-expo",
	rootDir: ".",
	transformIgnorePatterns: [
		"node_modules/(?!((?:\\.bun/.+?/node_modules/)?((jest-)?react-native|@react-native(-community)?|@react-native/.*|expo(nent)?|expo-modules-core|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|uniwind|@opencoder/branding|nuqs)))",
	],
	testPathIgnorePatterns: [
		"<rootDir>/domain/types/__tests__/",
		"<rootDir>/components/permissions/",
		"<rootDir>/lib/chat/__tests__/permission-queries.test.tsx",
		"<rootDir>/components/auth/",
		"<rootDir>/lib/auth-queries.test.tsx",
		"<rootDir>/lib/workspace-queries.test.tsx",
		"<rootDir>/tests/sign-in.test.tsx",
		"<rootDir>/tests/workspace-lists.test.tsx",
		"<rootDir>/tests/workspaces-screen.test.tsx",
		"<rootDir>/components/chat/__tests__/ChatInput.test.tsx",
		"<rootDir>/components/chat/__tests__/MessageHeader.test.tsx",
		"<rootDir>/components/terminal/__tests__/Terminal.test.tsx",
		"<rootDir>/components/select.native.test.tsx",
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
