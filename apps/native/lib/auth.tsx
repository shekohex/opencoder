import { API } from "@coder/sdk";
import React from "react";
import { useStorageState } from "@/lib/useStorageState";

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
	setBaseUrl: () => null,
});

// This hook can be used to access the user info.
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
			API.setHost(baseUrl);
		}
		if (session) {
			API.setSessionToken(session);
		}
	}, [baseUrl, session]);

	const setBaseUrl = (url: string) => {
		API.setHost(url);
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
