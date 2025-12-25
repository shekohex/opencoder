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
