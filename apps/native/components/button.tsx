import { forwardRef, type ReactNode } from "react";
import {
	ActivityIndicator,
	Pressable,
	type PressableProps,
	Text,
	type View,
	type ViewStyle,
} from "react-native";
import { palette, semanticColors } from "@/lib/tokens";
import { useColorScheme } from "@/lib/use-color-scheme";

export type ButtonVariant =
	| "primary"
	| "secondary"
	| "ghost"
	| "danger"
	| "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<PressableProps, "style"> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	loading?: boolean;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	children?: ReactNode;
	className?: string;
	style?: ViewStyle;
}

const VARIANTS: Record<ButtonVariant, string> = {
	primary:
		"bg-icon-interactive hover:bg-icon-interactive/90 active:bg-icon-interactive/80 border-transparent",
	secondary:
		"bg-surface-weak hover:bg-surface-hover active:bg-surface-active border-transparent",
	ghost:
		"bg-transparent hover:bg-surface-hover active:bg-surface-active border-transparent",
	danger:
		"bg-icon-critical hover:bg-icon-critical/90 active:bg-icon-critical/80 border-transparent",
	outline:
		"bg-transparent border-border hover:bg-surface-hover active:bg-surface-active",
};

const SIZES: Record<ButtonSize, string> = {
	sm: "h-8 px-3 rounded-md gap-2",
	md: "h-10 px-4 rounded-md gap-2",
	lg: "h-12 px-6 rounded-lg gap-3",
};

const TEXT_SIZES: Record<ButtonSize, string> = {
	sm: "text-sm",
	md: "text-base",
	lg: "text-lg",
};

export const Button = forwardRef<View, ButtonProps>(
	(
		{
			variant = "primary",
			size = "md",
			loading = false,
			leftIcon,
			rightIcon,
			children,
			className = "",
			disabled,
			...props
		},
		ref,
	) => {
		const { colorScheme } = useColorScheme();
		const colors = semanticColors[colorScheme];

		const baseStyles =
			"flex-row items-center justify-center border font-medium transition-colors focus-ring";
		const variantStyles = disabled ? "" : VARIANTS[variant];
		const sizeStyles = SIZES[size];
		const disabledStyles = disabled
			? `${loading ? "opacity-80" : "opacity-50"} pointer-events-none ${loading ? "bg-icon-interactive" : "bg-input-disabled"}`
			: "";

		const textBaseStyle = "font-medium text-center";
		const textSizeStyle = TEXT_SIZES[size];

		const isWhiteText = variant === "primary" || variant === "danger";

		const getTextColorClass = () => {
			if (disabled && !loading) return "text-foreground-weak";
			if (isWhiteText) return "text-white";
			return "text-foreground";
		};

		const indicatorColor = isWhiteText ? palette.white : colors.text.base;

		return (
			<Pressable
				ref={ref}
				className={`${baseStyles} ${variantStyles} ${sizeStyles} ${disabledStyles} ${className}`}
				disabled={disabled || loading}
				accessibilityRole="button"
				accessibilityState={{ disabled: disabled || loading, busy: loading }}
				{...props}
			>
				{loading && (
					<ActivityIndicator
						size="small"
						color={indicatorColor}
						style={{ marginRight: 8 }}
					/>
				)}
				{!loading && leftIcon}
				{typeof children === "string" ? (
					<Text
						className={`${textBaseStyle} ${textSizeStyle} ${getTextColorClass()}`}
					>
						{children}
					</Text>
				) : (
					children
				)}
				{!loading && rightIcon}
			</Pressable>
		);
	},
);

Button.displayName = "Button";
