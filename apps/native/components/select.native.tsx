import { Feather } from "@expo/vector-icons";
import { FocusScope } from "@react-native-aria/focus";
import { useListBox, useOption } from "@react-native-aria/listbox";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import Animated, {
	FadeIn,
	FadeOut,
	SlideInDown,
	SlideOutDown,
} from "react-native-reanimated";
import type { ListState, Node } from "react-stately";
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
	const isControlled = value !== undefined;
	const [internalValues, setInternalValues] = useState<Set<SelectValue>>(() =>
		normalizeToSet(defaultValue, selectionMode),
	);
	const selectedValues = isControlled
		? normalizeToSet(value, selectionMode)
		: internalValues;

	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<View>(null);

	const handleSelectionChange = useCallback(
		(newValues: Set<SelectValue>) => {
			if (!isControlled) {
				setInternalValues(newValues);
			}
			onValueChange?.(setToValue(newValues, selectionMode));
			if (selectionMode === "single") {
				setIsOpen(false);
			}
		},
		[isControlled, onValueChange, selectionMode],
	);

	const items = useMemo(() => buildItems(children), [children]);
	const listState = useListState({
		selectionMode,
		selectedKeys: selectedValues,
		onSelectionChange: (keys) => {
			const newSet =
				keys === "all"
					? new Set(items.map((i) => i.key))
					: (keys as Set<SelectValue>);
			handleSelectionChange(newSet);
		},
		disabledKeys: new Set(items.filter((i) => i.disabled).map((i) => i.key)),
		items,
		children: (item) => <Item key={item.key}>{item.label}</Item>,
	});

	const ctx = useMemo(
		() => ({
			isOpen,
			setOpen: (open: boolean) => !disabled && setIsOpen(open),
			selectedValues,
			selectionMode,
			placeholder,
			disabled,
			listState: listState as unknown as ListState<T>,
			onSelectionChange: handleSelectionChange,
			label,
			triggerRef,
		}),
		[
			isOpen,
			selectedValues,
			selectionMode,
			placeholder,
			disabled,
			listState,
			handleSelectionChange,
			label,
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
	const {
		isOpen,
		setOpen,
		selectedValues,
		placeholder,
		disabled,
		listState,
		triggerRef,
	} = useSelectContext();

	const displayText = listState
		? getDisplayValue(selectedValues, listState.collection, placeholder)
		: (placeholder ?? "Select...");

	return (
		<Pressable
			ref={triggerRef}
			onPress={() => setOpen(!isOpen)}
			disabled={disabled}
			accessibilityRole="button"
			accessibilityState={{ expanded: isOpen, disabled }}
			accessibilityLabel={displayText}
			className={`flex-row items-center justify-between rounded-md border border-border bg-input px-3 py-2.5 ${disabled ? "opacity-50" : ""} ${className ?? ""}`}
		>
			{children ?? (
				<>
					<Text className="text-foreground">{displayText}</Text>
					<Feather
						name={isOpen ? "chevron-up" : "chevron-down"}
						size={16}
						color="var(--color-icon)"
					/>
				</>
			)}
		</Pressable>
	);
}

export function SelectContent({ className }: SelectContentProps) {
	const { isOpen, setOpen, listState, label } = useSelectContext();

	if (!listState) return null;

	return (
		<Modal
			transparent
			visible={isOpen}
			animationType="none"
			onRequestClose={() => setOpen(false)}
			statusBarTranslucent
		>
			<Animated.View
				entering={FadeIn.duration(200)}
				exiting={FadeOut.duration(150)}
				className="absolute inset-0 bg-black/50"
			>
				<Pressable
					className="absolute inset-0"
					onPress={() => setOpen(false)}
					accessibilityRole="none"
				/>
			</Animated.View>

			<View
				className="pointer-events-box-none flex-1 justify-end"
				pointerEvents="box-none"
			>
				<FocusScope contain restoreFocus autoFocus>
					<Animated.View
						entering={SlideInDown.duration(250).springify().damping(20)}
						exiting={SlideOutDown.duration(200)}
						className={`rounded-t-2xl border-border border-t bg-background pb-8 ${className ?? ""}`}
					>
						<View className="items-center py-3">
							<View className="h-1 w-10 rounded-full bg-border" />
						</View>

						{label && (
							<Text className="px-4 pb-2 font-semibold text-foreground text-lg">
								{label}
							</Text>
						)}

						<SelectListBox listState={listState} label={label} />
					</Animated.View>
				</FocusScope>
			</View>
		</Modal>
	);
}

function SelectListBox<T>({
	listState,
	label,
}: {
	listState: ListState<T>;
	label?: string;
}) {
	const listRef = useRef<View>(null);

	const { listBoxProps } = useListBox(
		{
			label: label ?? "Select",
			autoFocus: "first",
			disallowEmptySelection: true,
		},
		listState,
		listRef as unknown as React.RefObject<HTMLElement>,
	);

	return (
		<View
			ref={listRef}
			{...(listBoxProps as object)}
			accessibilityRole="list"
			className="max-h-80"
		>
			{[...listState.collection].map((item) => (
				<OptionItem key={item.key} item={item} state={listState} />
			))}
		</View>
	);
}

function OptionItem<T>({
	item,
	state,
}: {
	item: Node<T>;
	state: ListState<T>;
}) {
	const ref = useRef<View>(null);
	const isSelected = state.selectionManager.isSelected(item.key);
	const isDisabled = state.disabledKeys.has(item.key);

	const { optionProps } = useOption(
		{ key: item.key, isSelected, isDisabled },
		state,
		ref as unknown as React.RefObject<HTMLElement>,
	);

	return (
		<Pressable
			ref={ref}
			{...(optionProps as object)}
			accessibilityRole="menuitem"
			accessibilityState={{ selected: isSelected, disabled: isDisabled }}
			className={`flex-row items-center justify-between px-4 py-3.5 active:bg-surface-interactive ${isDisabled ? "opacity-50" : ""}`}
		>
			<Text
				className={`text-base text-foreground ${isSelected ? "font-semibold" : ""}`}
			>
				{item.rendered}
			</Text>
			{isSelected && (
				<Feather name="check" size={20} color="var(--color-icon-interactive)" />
			)}
		</Pressable>
	);
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
