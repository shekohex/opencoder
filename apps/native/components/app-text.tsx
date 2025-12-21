import { Platform, Text, type TextProps, type TextStyle } from "react-native";

import { useFontsConfig } from "@/lib/font-context";
import type { FontWeight } from "@/lib/font-registry";

export interface AppTextProps extends TextProps {
	className?: string;
}

export function AppText({ className = "", style, ...props }: AppTextProps) {
	const { resolveFont } = useFontsConfig();

	let weight: FontWeight = 400;

	const tokens = className.split(/\s+/);
	const cleanTokens = tokens.filter((token) => {
		if (token.startsWith("font-")) {
			if (["font-thin", "font-extralight", "font-light"].includes(token)) {
				weight = 300;
				return false;
			}
			if (token === "font-normal") {
				weight = 400;
				return false;
			}
			if (
				[
					"font-medium",
					"font-semibold",
					"font-bold",
					"font-extrabold",
					"font-black",
				].includes(token)
			) {
				weight = 700;
				return false;
			}
		}
		return true;
	});

	const cleanClassName = cleanTokens.join(" ");
	const fontFamily = resolveFont("sans", weight);

	const finalStyle = [
		{ fontFamily },
		style,
		Platform.OS === "android" && { fontWeight: String(weight) },
	].filter(Boolean) as TextStyle[];

	return <Text className={cleanClassName} style={finalStyle} {...props} />;
}
