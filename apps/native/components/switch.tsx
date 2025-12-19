import type { ReactNode } from "react";
import { Pressable, Text, View, type ViewProps } from "react-native";
import Animated, {
	interpolateColor,
	useAnimatedStyle,
	useDerivedValue,
	withTiming,
} from "react-native-reanimated";
import { useColorScheme } from "@/lib/use-color-scheme";

export interface SwitchProps extends Omit<ViewProps, "style"> {
	checked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
	disabled?: boolean;
	label?: ReactNode;
	description?: ReactNode;
	className?: string;
}

const TRACK_WIDTH = 44;
const TRACK_HEIGHT = 24;
const THUMB_SIZE = 20;
const PADDING = 2;

export function Switch({
	checked = false,
	onCheckedChange,
	disabled = false,
	label,
	description,
	className = "",
	...props
}: SwitchProps) {
	const { colorScheme } = useColorScheme();
	// Use manual colors because interpolation needs strings
	// Dark: Checked=Cobalt-9 (#034cff), Unchecked=Smoke-4 (#2d2828)
	// Light: Checked=Cobalt-9 (#034cff), Unchecked=Smoke-4 (#e9e8e8)
	// Disabled: Input-Disabled (Dark=#2d2828, Light=#e9e8e8)

	const activeColor = "#034cff"; // cobalt-9 (same in light/dark for interactive icon)
	const inactiveColor = colorScheme === "dark" ? "#2d2828" : "#e9e8e8"; // smoke-4

	const progress = useDerivedValue(() => {
		return withTiming(checked ? 1 : 0, { duration: 200 });
	});

	const trackStyle = useAnimatedStyle(() => {
		const backgroundColor = interpolateColor(
			progress.value,
			[0, 1],
			[inactiveColor, activeColor],
		);

		return {
			backgroundColor: disabled ? inactiveColor : backgroundColor,
		};
	});

	const thumbStyle = useAnimatedStyle(() => {
		const translateX =
			progress.value * (TRACK_WIDTH - THUMB_SIZE - PADDING * 2);
		return {
			transform: [{ translateX }],
		};
	});

	// We can use class names for colors if we avoid interpolateColor for background
	// But we want a smooth transition.
	// Let's try to just use classes for the track if we can, but Reanimated interpolateColor is smoother.
	// I'll stick to the manual colors for now to ensure it works, matching the `tokens.ts`.
	// input-active (cobalt-light-1/dark-1) vs input-bg (smoke-light-1/dark-2) isn't quite right for a Switch.
	// Usually Switch is Gray (off) -> Brand (on).
	// From global.css:
	// --color-input-disabled: #e9e8e8;
	// --color-surface-interactive: #eaf2ff; ... wait, primary button is interactive.
	// Let's use #e9e8e8 (smoke-4) for off and #034cff (cobalt-9) for on.

	return (
		<Pressable
			onPress={() => !disabled && onCheckedChange?.(!checked)}
			className={`flex-row items-center gap-3 ${disabled ? "opacity-50" : ""} ${className}`}
			accessibilityRole="switch"
			accessibilityState={{ checked, disabled }}
			disabled={disabled}
			{...props}
		>
			<Animated.View
				style={[
					{
						width: TRACK_WIDTH,
						height: TRACK_HEIGHT,
						borderRadius: 9999,
						padding: PADDING,
						justifyContent: "center",
					},
					trackStyle,
				]}
			>
				<Animated.View
					style={[
						{
							width: THUMB_SIZE,
							height: THUMB_SIZE,
							borderRadius: 9999,
							backgroundColor: "white",
							shadowColor: "#000",
							shadowOffset: { width: 0, height: 2 },
							shadowOpacity: 0.2,
							shadowRadius: 2.5,
							elevation: 2,
						},
						thumbStyle,
					]}
				/>
			</Animated.View>

			{(label || description) && (
				<View className="flex-1 gap-0.5">
					{label && (
						<Text className="font-medium text-base text-foreground">
							{label}
						</Text>
					)}
					{description && (
						<Text className="text-foreground-weak text-sm">{description}</Text>
					)}
				</View>
			)}
		</Pressable>
	);
}
