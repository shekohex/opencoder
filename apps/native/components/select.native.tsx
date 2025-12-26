import { useActionSheet } from "@expo/react-native-action-sheet";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
	type GestureResponderEvent,
	Pressable,
	Text,
	View,
} from "react-native";
import type { ListState } from "react-stately";
import { Item, useListState } from "react-stately";

import {
	getDisplayValue,
	hasTrigger,
	normalizeToSet,
	type SelectContentProps,
	SelectContext,
	type SelectGroupLabelProps,
	type SelectGroupProps,
	type SelectOptionProps,
	type SelectRootProps,
	type SelectTriggerProps,
	type SelectValue,
	setToValue,
	useSelectContext,
} from "./select.shared";

interface InternalItem {
	key: string;
	label: string;
	disabled?: boolean;
}

function buildItems(children: React.ReactNode): InternalItem[] {
	const items: InternalItem[] = [];
	React.Children.forEach(children, (child) => {
		if (!React.isValidElement(child)) return;
		if (child.type === SelectOption) {
			const props = child.props as SelectOptionProps;
			items.push({
				key: props.value,
				label:
					typeof props.children === "string"
						? props.children
						: String(props.value),
				disabled: props.disabled,
			});
		} else if (child.type === SelectGroup) {
			const groupChildren = (child.props as SelectGroupProps).children;
			items.push(...buildItems(groupChildren));
		}
	});
	return items;
}

export function Select<T = unknown>({
	children,
	value,
	defaultValue,
	onValueChange,
	selectionMode = "single",
	placeholder,
	disabled = false,
	label,
}: SelectRootProps<T>) {
	const { showActionSheetWithOptions } = useActionSheet();

	const isControlled = value !== undefined;
	const [internalValues, setInternalValues] = useState<Set<SelectValue>>(() =>
		normalizeToSet(defaultValue, selectionMode),
	);
	const selectedValues = isControlled
		? normalizeToSet(value, selectionMode)
		: internalValues;

	const triggerRef = useRef<View>(null);

	const items = useMemo(() => buildItems(children), [children]);
	const listState = useListState({
		selectionMode,
		selectedKeys: selectedValues,
		onSelectionChange: (keys) => {
			const newSet =
				keys === "all"
					? new Set(items.map((i) => i.key))
					: (keys as Set<SelectValue>);
			if (!isControlled) {
				setInternalValues(newSet);
			}
			onValueChange?.(setToValue(newSet, selectionMode));
		},
		disabledKeys: new Set(items.filter((i) => i.disabled).map((i) => i.key)),
		items,
		children: (item) => <Item key={item.key}>{item.label}</Item>,
	});

	const handleShowActionSheet = useCallback(() => {
		if (disabled) return;

		const options = items.map((item) => item.label);
		const cancelButtonIndex = options.length;

		const selectedIndex = items.findIndex((item) =>
			selectedValues.has(item.key),
		);

		const optionsWithCancel = [...options, "Cancel"];
		const buttonOptions: {
			options: string[];
			cancelButtonIndex: number;
			title?: string;
			destructiveButtonIndex?: number;
		} = {
			options: optionsWithCancel,
			cancelButtonIndex,
			title: label,
		};

		if (selectedIndex >= 0) {
			buttonOptions.destructiveButtonIndex = selectedIndex;
		}

		showActionSheetWithOptions(buttonOptions, (buttonIndex) => {
			if (
				buttonIndex === cancelButtonIndex ||
				buttonIndex === null ||
				buttonIndex === undefined
			) {
				return;
			}
			const item = items[buttonIndex as number];
			if (item && !item.disabled) {
				listState.selectionManager.select(item.key);
			}
		});
	}, [
		disabled,
		items,
		selectedValues,
		listState,
		label,
		showActionSheetWithOptions,
	]);

	const ctx = useMemo(
		() => ({
			isOpen: false,
			setOpen: handleShowActionSheet as unknown as (open: boolean) => void,
			selectedValues,
			selectionMode,
			placeholder,
			disabled,
			listState: listState as unknown as ListState<T>,
			onSelectionChange: (newValues: Set<SelectValue>) => {
				if (!isControlled) {
					setInternalValues(newValues);
				}
				onValueChange?.(setToValue(newValues, selectionMode));
			},
			label,
			triggerRef,
		}),
		[
			handleShowActionSheet,
			selectedValues,
			selectionMode,
			placeholder,
			disabled,
			listState,
			label,
			isControlled,
			onValueChange,
		],
	);

	const hasCustomTrigger = hasTrigger(children, SelectTrigger);

	return (
		<SelectContext.Provider value={ctx}>
			{!hasCustomTrigger && <SelectTrigger />}
			{children}
		</SelectContext.Provider>
	);
}

export function SelectTrigger({ children, className }: SelectTriggerProps) {
	const { selectedValues, placeholder, disabled, listState, setOpen } =
		useSelectContext();

	const displayText = listState
		? getDisplayValue(selectedValues, listState.collection, placeholder)
		: (placeholder ?? "Select...");

	const handlePress = useCallback(() => {
		(setOpen as unknown as () => void)();
	}, [setOpen]);

	if (React.isValidElement(children)) {
		const childProps = children.props as Partial<{
			onPress?: (e: GestureResponderEvent) => void;
		}>;
		return React.cloneElement(children, {
			onPress: (e: GestureResponderEvent) => {
				childProps.onPress?.(e);
				handlePress();
			},
		} as Partial<{ onPress?: (e: GestureResponderEvent) => void }>);
	}

	return (
		<Pressable
			onPress={handlePress}
			disabled={disabled}
			accessibilityRole="button"
			accessibilityState={{ expanded: false, disabled }}
			accessibilityLabel={displayText}
			className={`flex-row items-center justify-between rounded-md border border-border bg-input px-3 py-2.5 ${disabled ? "opacity-50" : ""} ${className ?? ""}`}
		>
			{children ?? <Text className="text-foreground">{displayText}</Text>}
		</Pressable>
	);
}

export function SelectContent(_props: SelectContentProps) {
	return null;
}

export function SelectOption<T = unknown>(_props: SelectOptionProps<T>) {
	return null;
}

export function SelectGroup({ children, className }: SelectGroupProps) {
	return <View className={`py-1 ${className ?? ""}`}>{children}</View>;
}

export function SelectGroupLabel({
	children,
	className,
}: SelectGroupLabelProps) {
	return (
		<Text
			className={`px-4 py-2 font-semibold text-foreground-weak text-xs uppercase ${className ?? ""}`}
		>
			{children}
		</Text>
	);
}

Select.Trigger = SelectTrigger;
Select.Content = SelectContent;
Select.Option = SelectOption;
Select.Group = SelectGroup;
Select.GroupLabel = SelectGroupLabel;
