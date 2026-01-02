import { Feather } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { PressableProps, ViewProps } from "react-native";
import { Pressable, View } from "react-native";
import Animated, {
	FadeIn,
	FadeOut,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";

import {
	AccordionContext,
	AccordionItemContext,
	type AccordionType,
	type AccordionValue,
	normalizeAccordionValue,
	serializeAccordionValue,
	useAccordionContext,
	useAccordionItemContext,
} from "./accordion.shared";

export interface AccordionRootProps {
	children?: React.ReactNode;
	type?: AccordionType;
	collapsible?: boolean;
	value?: AccordionValue;
	defaultValue?: AccordionValue;
	onValueChange?: (value: AccordionValue) => void;
	disabled?: boolean;
	disableAnimation?: boolean;
	showDividers?: boolean;
	className?: string;
}

export interface AccordionItemProps {
	value: string;
	children?: React.ReactNode;
	className?: string;
	isDisabled?: boolean;
}

export interface AccordionTriggerProps extends PressableProps {
	children?: React.ReactNode;
	className?: string;
}

export interface AccordionContentProps extends ViewProps {
	children?: React.ReactNode;
	className?: string;
}

export interface AccordionIndicatorProps extends ViewProps {
	size?: number;
	className?: string;
	animationDisabled?: boolean;
}

function AccordionRoot({
	children,
	type = "single",
	collapsible = true,
	value,
	defaultValue,
	onValueChange,
	disabled = false,
	disableAnimation = false,
	showDividers = false,
	className,
}: AccordionRootProps) {
	const isControlled = value !== undefined;
	const [internalValue, setInternalValue] = useState<string[]>(() =>
		normalizeAccordionValue(defaultValue, type),
	);

	const selectedValues = isControlled
		? normalizeAccordionValue(value, type)
		: internalValue;

	const setValue = useCallback(
		(next: string[]) => {
			if (!isControlled) {
				setInternalValue(next);
			}
			onValueChange?.(serializeAccordionValue(next, type));
		},
		[isControlled, onValueChange, type],
	);

	const toggleValue = useCallback(
		(itemValue: string, itemDisabled?: boolean) => {
			if (disabled || itemDisabled) return;
			const hasValue = selectedValues.includes(itemValue);

			if (type === "single") {
				if (hasValue) {
					if (collapsible) {
						setValue([]);
					}
					return;
				}
				setValue([itemValue]);
				return;
			}

			if (hasValue) {
				setValue(selectedValues.filter((v) => v !== itemValue));
				return;
			}
			setValue([...selectedValues, itemValue]);
		},
		[collapsible, disabled, selectedValues, setValue, type],
	);

	const ctx = useMemo(
		() => ({
			type,
			value: selectedValues,
			collapsible,
			disabled,
			disableAnimation,
			setValue,
			toggleValue,
		}),
		[
			type,
			selectedValues,
			collapsible,
			disabled,
			disableAnimation,
			setValue,
			toggleValue,
		],
	);

	const items = useMemo(() => React.Children.toArray(children), [children]);
	const content = useMemo(() => {
		if (!showDividers) return items;
		const entries: React.ReactNode[] = [];
		items.forEach((child, index) => {
			entries.push(child);
			if (index < items.length - 1) {
				const dividerKey = React.isValidElement(child)
					? (child.key ??
						(child.props as { value?: string }).value ??
						child.type?.toString())
					: String(child);
				entries.push(
					<View
						key={`accordion-divider-${String(dividerKey)}`}
						className="h-px bg-border"
					/>,
				);
			}
		});
		return entries;
	}, [items, showDividers]);

	return (
		<AccordionContext.Provider value={ctx}>
			<View
				className={`neo-shadow-md flex-col rounded-none border-4 border-black ${className ?? ""}`}
			>
				{content}
			</View>
		</AccordionContext.Provider>
	);
}

function AccordionItem({
	value,
	children,
	className,
	isDisabled = false,
}: AccordionItemProps) {
	const {
		value: selectedValues,
		disabled,
		toggleValue,
	} = useAccordionContext();
	const isExpanded = selectedValues.includes(value);
	const itemDisabled = disabled || isDisabled;

	const ctx = useMemo(
		() => ({
			value,
			isExpanded,
			isDisabled: itemDisabled,
			toggle: () => toggleValue(value, itemDisabled),
		}),
		[value, isExpanded, itemDisabled, toggleValue],
	);

	return (
		<AccordionItemContext.Provider value={ctx}>
			<View
				className={`flex-col border-black border-b-4 bg-surface-muted/20 ${className ?? ""}`}
			>
				{children}
			</View>
		</AccordionItemContext.Provider>
	);
}

function AccordionTrigger({
	children,
	className,
	onPress,
	...props
}: AccordionTriggerProps) {
	const { isExpanded, isDisabled, toggle } = useAccordionItemContext();

	return (
		<Pressable
			onPress={(event) => {
				onPress?.(event);
				toggle();
			}}
			disabled={isDisabled}
			accessibilityRole="button"
			accessibilityState={{ expanded: isExpanded, disabled: isDisabled }}
			className={`active:neo-shadow-sm flex-row items-center justify-between gap-2 px-3 py-3 active:translate-x-[2px] active:translate-y-[2px] ${isDisabled ? "opacity-50" : ""} ${className ?? ""}`}
			{...props}
		>
			{children}
		</Pressable>
	);
}

function AccordionIndicator({
	size = 16,
	className,
	animationDisabled,
	style,
	...props
}: AccordionIndicatorProps) {
	const { isExpanded } = useAccordionItemContext();
	const { disableAnimation } = useAccordionContext();
	const rotation = useSharedValue(isExpanded ? 1 : 0);
	const isAnimationDisabled = disableAnimation || animationDisabled;

	const rStyle = useAnimatedStyle(() => ({
		transform: [{ rotate: `${rotation.value * -180}deg` }],
	}));

	useEffect(() => {
		if (isAnimationDisabled) {
			rotation.value = isExpanded ? 1 : 0;
			return;
		}
		rotation.value = withSpring(isExpanded ? 1 : 0, {
			damping: 140,
			stiffness: 1000,
			mass: 4,
		});
	}, [isAnimationDisabled, isExpanded, rotation]);

	return (
		<Animated.View
			className={`items-center justify-center ${className ?? ""}`}
			style={[rStyle, style]}
			{...props}
		>
			<Feather name="chevron-down" size={size} color="var(--color-icon)" />
		</Animated.View>
	);
}

function AccordionContent({
	children,
	className,
	style,
	...props
}: AccordionContentProps) {
	const { isExpanded } = useAccordionItemContext();
	const { disableAnimation } = useAccordionContext();

	if (!isExpanded) return null;

	return (
		<Animated.View
			entering={disableAnimation ? undefined : FadeIn.duration(150)}
			exiting={disableAnimation ? undefined : FadeOut.duration(150)}
		>
			<View className={`px-3 pb-3 ${className ?? ""}`} style={style} {...props}>
				{children}
			</View>
		</Animated.View>
	);
}

export const Accordion = Object.assign(AccordionRoot, {
	Item: AccordionItem,
	Trigger: AccordionTrigger,
	Content: AccordionContent,
	Indicator: AccordionIndicator,
});
