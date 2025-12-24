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

export function useDeviceStart(provider: string) {
	return useQuery({
		queryKey: ["deviceStart", provider],
		queryFn: async () => {
			return API.getExternalAuthDevice(provider);
		},
		enabled: !!provider,
	});
}

export function useDevicePoll(provider: string) {
	return useMutation({
		mutationFn: async (deviceCode: string) => {
			// Cast the void return to what we actually get from JSON
			return (await API.exchangeExternalAuthDevice(provider, {
				device_code: deviceCode,
			})) as unknown as { session_token: string };
		},
	});
}
