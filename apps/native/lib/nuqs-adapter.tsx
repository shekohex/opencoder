import {
	router,
	type UnknownOutputParams,
	useGlobalSearchParams,
	useSegments,
} from "expo-router";
import {
	type unstable_AdapterInterface,
	unstable_createAdapterProvider,
} from "nuqs/adapters/custom";
import { useCallback } from "react";

function useGlobalQueryParams<
	TParams extends UnknownOutputParams = UnknownOutputParams,
>() {
	const params = useGlobalSearchParams<TParams>();
	const segments = useSegments();
	const urlParams = segments
		.filter((segment) => segment.startsWith("[") && segment.endsWith("]"))
		.map((segment) => segment.slice(1, -1));

	return Object.fromEntries(
		Object.entries(params)
			.filter(([key]) => !urlParams.includes(key))
			.filter(([, value]) => value !== undefined && value !== "undefined"),
	) as TParams;
}

function useNuqsExpoRouterAdapter(): unstable_AdapterInterface {
	const params = useGlobalQueryParams<Record<string, string>>();

	const updateUrl = useCallback(
		(searchParams: URLSearchParams) => {
			const newParams = Object.fromEntries(searchParams);
			const oldParams = params;
			const paramsToRemoveKeys = Object.keys(oldParams).filter(
				(oldKey) => !(oldKey in newParams),
			);
			const paramsToRemove = Object.fromEntries(
				paramsToRemoveKeys.map((key) => [key, undefined]),
			);
			router.setParams({
				...paramsToRemove,
				...newParams,
			});
		},
		[params],
	);

	const getSearchParamsSnapshot = useCallback(
		() => new URLSearchParams(params),
		[params],
	);

	return {
		searchParams: new URLSearchParams(params),
		updateUrl,
		rateLimitFactor: 2,
		getSearchParamsSnapshot,
	};
}

export const NuqsAdapter = unstable_createAdapterProvider(
	useNuqsExpoRouterAdapter,
);
