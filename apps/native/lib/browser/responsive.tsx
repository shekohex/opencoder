import type React from "react";
import { View, type ViewStyle } from "react-native";

import { getBreakpoint } from "./viewport";

export type ResponsiveStyle = {
	mobile?: Record<string, unknown>;
	tablet?: Record<string, unknown>;
	desktop?: Record<string, unknown>;
};

export type ResponsiveProps<T> = {
	mobile: T;
	tablet: T;
	desktop: T;
};

export type ResponsivePropsVariant = {
	mobile: unknown;
	tablet: unknown;
	desktop: unknown;
};

export function createResponsiveStyles(styles: ResponsiveStyle) {
	return (width: number): ViewStyle => {
		const breakpoint = getBreakpoint(width);
		if (breakpoint === "xl") return styles.desktop ?? {};
		if (breakpoint === "lg") return styles.tablet ?? styles.mobile ?? {};
		if (breakpoint === "md") return styles.mobile ?? {};
		return styles.mobile ?? {};
	};
}

export function useResponsiveProps<T>(
	props: ResponsiveProps<T> | ResponsivePropsVariant,
	width: number,
): T {
	const breakpoint = getBreakpoint(width);
	if (breakpoint === "xl") return (props as ResponsiveProps<T>).desktop;
	if (breakpoint === "lg") return (props as ResponsiveProps<T>).tablet;
	return (props as ResponsiveProps<T>).mobile;
}

export function ResponsiveContainer({
	children,
	style,
}: {
	children: React.ReactNode;
	style?: ViewStyle;
}) {
	return (
		<View testID="responsive-container" style={[{ flex: 1 }, style]}>
			{children}
		</View>
	);
}
