import type React from "react";
import { useEffect } from "react";
import { useHotkeysContext } from "react-hotkeys-hook";

export function HotkeysScope({
	name,
	children,
}: {
	name: string;
	children: React.ReactNode;
}) {
	const { enableScope, disableScope } = useHotkeysContext();

	useEffect(() => {
		enableScope(name);
		return () => {
			disableScope(name);
		};
	}, [name, enableScope, disableScope]);

	return <>{children}</>;
}
