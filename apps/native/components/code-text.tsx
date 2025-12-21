import { Platform, Text, type TextProps, type TextStyle } from "react-native";

import { useFontsConfig } from "@/lib/font-context";
import { type FontWeight, getFontFamily } from "@/lib/font-registry";

export interface CodeTextProps extends TextProps {
	className?: string;
	forceNerd?: boolean;
}

export function CodeText({
	className = "",
	forceNerd,
	style,
	...props
}: CodeTextProps) {
	const { monoSet, monoFlavor } = useFontsConfig();

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

	const flavor =
		forceNerd !== undefined ? (forceNerd ? "nerd" : "normal") : monoFlavor;

	const fontFamily = getFontFamily({
		role: "mono",
		weight,
		family: monoSet,
		flavor,
	});

	const finalStyle = [
		{ fontFamily },
		style,
		Platform.OS === "android" && { fontWeight: String(weight) },
	].filter(Boolean) as TextStyle[];

	return <Text className={cleanClassName} style={finalStyle} {...props} />;
}
