import {
	MutationCache,
	QueryCache,
	QueryClient,
	type QueryClientConfig,
} from "@tanstack/react-query";

const defaultOptions: QueryClientConfig["defaultOptions"] = {
	queries: {
		retry: 1,
		staleTime: 30_000,
		gcTime: 5 * 60_000,
	},
};

export function createQueryClient() {
	return new QueryClient({
		defaultOptions,
		queryCache: new QueryCache({
			onError: (error) => {
				if (__DEV__) {
					console.warn("React Query error", error);
				}
			},
		}),
		mutationCache: new MutationCache({
			onError: (error) => {
				if (__DEV__) {
					console.warn("React Query mutation error", error);
				}
			},
		}),
	});
}
