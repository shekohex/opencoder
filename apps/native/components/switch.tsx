import type { ReactNode } from "react";
import { Pressable, Text, View, type ViewProps } from "react-native";
import Animated, {
	interpolateColor,
	useAnimatedStyle,
	useDerivedValue,
	withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/lib/theme-context";

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
	const { theme } = useTheme();

	const activeColor = theme.icon.interactive;
	const inactiveColor = theme.input.disabled;

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
