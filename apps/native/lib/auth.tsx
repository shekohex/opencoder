import { API } from "@coder/sdk";
import React from "react";
import { Platform } from "react-native";
import { useStorageState } from "@/lib/useStorageState";

function isWeb(): boolean {
	return Platform.OS === "web";
}

function getProxyUrl(): string {
	if (typeof window !== "undefined" && window.location) {
		return window.location.origin;
	}
	return "http://localhost:8081";
}

const AuthContext = React.createContext<{
	signIn: (token: string) => void;
	signOut: () => void;
	session?: string | null;
	isLoading: boolean;
	baseUrl?: string | null;
	setBaseUrl: (url: string) => void;
}>({
	signIn: () => null,
	signOut: () => null,
	session: null,
	isLoading: false,
	baseUrl: null,
	setBaseUrl: () => {},
});

export function useSession() {
	const value = React.useContext(AuthContext);
	if (process.env.NODE_ENV !== "production") {
		if (!value) {
			throw new Error("useSession must be wrapped in a <SessionProvider />");
		}
	}

	return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
	const [[isLoadingSession, session], setSession] = useStorageState("session");
	const [[isLoadingBaseUrl, baseUrl], setBaseUrlState] =
		useStorageState("base_url");

	React.useEffect(() => {
		if (baseUrl) {
			if (isWeb()) {
				API.setHost(getProxyUrl());
				API.setProxyTarget(baseUrl);
			} else {
				API.setHost(baseUrl);
				API.setProxyTarget(undefined);
			}
		}
		if (session) {
			API.setSessionToken(session);
		}
	}, [baseUrl, session]);

	const setBaseUrl = (url: string) => {
		if (isWeb()) {
			API.setHost(getProxyUrl());
			API.setProxyTarget(url);
		} else {
			API.setHost(url);
			API.setProxyTarget(undefined);
		}
		setBaseUrlState(url);
	};

	const signIn = (token: string) => {
		API.setSessionToken(token);
		setSession(token);
	};

	const signOut = () => {
		API.setSessionToken("");
		setSession(null);
	};

	return (
		<AuthContext.Provider
			value={{
				signIn,
				signOut,
				session,
				isLoading: isLoadingSession || isLoadingBaseUrl,
				baseUrl,
				setBaseUrl,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
}
