import * as WebBrowser from "expo-web-browser";
import { useCallback } from "react";
import { useSession } from "@/lib/auth";

export function useCoderBrowser() {
	const { baseUrl } = useSession();

	const openTemplates = useCallback(async () => {
		if (!baseUrl) return;
		const cleanBaseUrl = baseUrl.replace(/\/$/, "");
		await WebBrowser.openBrowserAsync(`${cleanBaseUrl}/templates`);
	}, [baseUrl]);

	const openBuildPage = useCallback(
		async (owner: string, workspace: string, buildNumber: number) => {
			if (!baseUrl) return;
			const cleanBaseUrl = baseUrl.replace(/\/$/, "");
			await WebBrowser.openBrowserAsync(
				`${cleanBaseUrl}/@${owner}/${workspace}/builds/${buildNumber}`,
			);
		},
		[baseUrl],
	);

	return { openTemplates, openBuildPage };
}
