const React = require("react");
const { QueryClient, QueryClientProvider } = require("@tanstack/react-query");

const testQueryClient = new QueryClient({
	defaultOptions: {
		queries: { retry: false },
		mutations: { retry: false },
	},
});

const TestProvider = ({ children }) => {
	return React.createElement(
		QueryClientProvider,
		{
			client: testQueryClient,
		},
		children,
	);
};

global.TestQueryClientProvider = TestProvider;
