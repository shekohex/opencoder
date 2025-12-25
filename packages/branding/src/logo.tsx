import type React from "react";
import Svg, { Text, TSpan } from "react-native-svg";
import { brandColors } from "./colors";
import { fonts } from "./fonts";

export interface LogoProps {
	mode?: "light" | "dark";
	width?: number | string;
	height?: number | string;
}

export const Logo: React.FC<LogoProps> = ({
	mode = "light",
	width = "100%",
	height = "auto",
}) => {
	const colors = brandColors[mode];
	return (
		<Svg viewBox="0 0 500 100" width={width} height={height}>
			<Text
				x="50%"
				y="68"
				textAnchor="middle"
				fontSize="74"
				letterSpacing="-2"
				fontFamily={fonts.turretRoad}
				fontWeight="800"
			>
				<TSpan fill={colors.open}>open</TSpan>
				<TSpan fill={colors.coder}>coder</TSpan>
			</Text>
		</Svg>
	);
};
