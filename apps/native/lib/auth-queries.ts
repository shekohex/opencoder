import { API } from "@coder/sdk";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useAuthMethods() {
	return useQuery({
		queryKey: ["authMethods"],
		queryFn: () => API.getAuthMethods(),
	});
}

export function useLogin() {
	return useMutation({
		mutationFn: async ({
			email,
			password,
		}: {
			email: string;
			password: string;
		}) => {
			return API.login(email, password);
		},
	});
}

export function useGitHubDeviceStart() {
	return useQuery({
		queryKey: ["githubDeviceStart"],
		queryFn: async () => {
			return API.getOAuth2GitHubDevice();
		},
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		staleTime: 899 * 1000,
		gcTime: 899 * 1000,
	});
}

export function useGitHubDeviceCallback() {
	return useMutation({
		mutationFn: async ({
			deviceCode,
			state,
		}: {
			deviceCode: string;
			state: string;
		}) => {
			return API.getOAuth2GitHubDeviceFlowCallback(deviceCode, state);
		},
	});
}
