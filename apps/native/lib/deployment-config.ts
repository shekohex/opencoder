import { useQuery } from "@tanstack/react-query";

import { useSession } from "@/lib/auth";
import { coderFetchJson } from "@/lib/coder-fetch";

export interface DeploymentConfig {
	wildcardAccessUrl: string | null;
}

const DEPLOYMENT_CONFIG_QUERY_KEY = ["deployment-config"] as const;

interface DeploymentConfigResponse {
	config?: {
		wildcard_access_url?: string;
	};
}

async function fetchDeploymentConfig(
	baseUrl: string,
	sessionToken: string,
): Promise<DeploymentConfig> {
	const data = await coderFetchJson<DeploymentConfigResponse>(
		baseUrl,
		sessionToken,
		"/api/v2/deployment/config",
	);

	return {
		wildcardAccessUrl: data?.config?.wildcard_access_url ?? null,
	};
}

export function useDeploymentConfig() {
	const { session, baseUrl } = useSession();

	return useQuery({
		queryKey: DEPLOYMENT_CONFIG_QUERY_KEY,
		queryFn: async () => {
			if (!baseUrl || !session) {
				throw new Error("No session or base URL");
			}
			return fetchDeploymentConfig(baseUrl, session);
		},
		enabled: !!baseUrl && !!session,
		staleTime: 24 * 60 * 60 * 1000,
		gcTime: 7 * 24 * 60 * 60 * 1000,
	});
}

export function useWildcardAccessUrl(): {
	wildcardAccessUrl: string | null;
	isLoading: boolean;
} {
	const { data, isLoading } = useDeploymentConfig();
	return {
		wildcardAccessUrl: data?.wildcardAccessUrl ?? null,
		isLoading,
	};
}
