import type { Href } from "expo-router";
import { Redirect, Stack, usePathname, useSegments } from "expo-router";
import { Text } from "react-native";

import { useSession } from "@/lib/auth";

export default function AppLayout() {
	const { session, isLoading } = useSession();
	const segments = useSegments();
	const pathname = usePathname();

	if (isLoading) {
		return <Text>Loading...</Text>;
	}

	if (!session) {
		const currentPath = segments.length > 0 ? pathname : undefined;
		const redirectTo = currentPath
			? `?redirectTo=${encodeURIComponent(currentPath)}`
			: "";
		return <Redirect href={`/sign-in${redirectTo}` as Href} />;
	}

	// This layout can be deferred because it's not the root layout.
	return (
		<Stack screenOptions={{ headerShown: false }} initialRouteName="(drawer)" />
	);
}
