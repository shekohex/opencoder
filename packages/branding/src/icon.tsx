import type { FC } from "react";
import Svg, { ClipPath, Defs, G, Rect } from "react-native-svg";
import { brandColors, colors } from "./colors";

type ThemeMode = keyof typeof brandColors;

export interface IconProps {
	mode?: ThemeMode;
	size?: number;
}

export const Icon: FC<IconProps> = ({ mode = "light", size = 48 }) => {
	const modeKey: ThemeMode = mode;
	const bColors = brandColors[modeKey];
	return (
		<Svg viewBox="0 0 48 48" width={size} height={size}>
			<Defs>
				<ClipPath id="c">
					<Rect width="36" height="36" rx="6" />
				</ClipPath>
			</Defs>
			<Rect x="1" y="1" width="46" height="46" rx="12" fill={bColors.outer} />
			<Rect x="4" y="4" width="40" height="40" rx="9" fill={bColors.inner} />
			<G transform="translate(6, 6)" clipPath="url(#c)">
				<Rect width="18" height="18" fill={colors.highlight} />
				<Rect x="18" y="0" width="18" height="18" fill={bColors.outer} />
				<Rect x="18" y="18" width="18" height="18" fill={colors.midGray} />
				<Rect x="0" y="18" width="18" height="18" fill={colors.darkGray} />
			</G>
		</Svg>
	);
};
