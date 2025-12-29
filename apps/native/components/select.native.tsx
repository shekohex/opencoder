import { Feather } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
	type GestureResponderEvent,
	Pressable,
	Text,
	View,
} from "react-native";
import type { ListState, Node } from "react-stately";
import { Item, useListState } from "react-stately";

import { useTheme } from "@/lib/theme-context";
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
	const { isOpen, setOpen, selectedValues, placeholder, disabled, listState } =
		useSelectContext();

	const displayText = listState
		? getDisplayValue(selectedValues, listState.collection, placeholder)
		: (placeholder ?? "Select...");

	const handlePress = useCallback(() => {
		setOpen(!isOpen);
	}, [isOpen, setOpen]);

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
			accessibilityState={{ expanded: isOpen, disabled }}
			accessibilityLabel={displayText}
			className={`flex-row items-center justify-between rounded-md border border-border bg-input px-3 py-2.5 ${disabled ? "opacity-50" : ""} ${className ?? ""}`}
		>
			<Text className="text-foreground">{displayText}</Text>
			<Feather
				name={isOpen ? "chevron-up" : "chevron-down"}
				size={16}
				color="var(--color-icon)"
			/>
		</Pressable>
	);
}

export function SelectContent({ className }: SelectContentProps) {
	const { isOpen, setOpen, listState, label, selectionMode } =
		useSelectContext();
	const { theme } = useTheme();
	const sheetRef = useRef<BottomSheetModal>(null);

	const handleSheetChanges = useCallback(
		(index: number) => {
			if (index < 0) {
				setOpen(false);
			}
		},
		[setOpen],
	);

	React.useEffect(() => {
		if (isOpen) {
			sheetRef.current?.present();
		} else {
			sheetRef.current?.dismiss();
		}
	}, [isOpen]);

	if (!listState) return null;

	return (
		<BottomSheetModal
			ref={sheetRef}
			snapPoints={["50%"]}
			onChange={handleSheetChanges}
			enablePanDownToClose
			backgroundStyle={{ backgroundColor: theme.background.base }}
			handleIndicatorStyle={{ backgroundColor: theme.border.base }}
		>
			<BottomSheetView className={`p-4 ${className ?? ""}`}>
				{label ? (
					<Text className="mb-2 font-semibold text-foreground text-sm">
						{label}
					</Text>
				) : null}
				<View className="gap-1">
					{[...listState.collection].map((item) => (
						<SelectOptionItem
							key={item.key}
							item={item}
							selectionMode={selectionMode}
							listState={listState}
							onRequestClose={() => setOpen(false)}
						/>
					))}
				</View>
			</BottomSheetView>
		</BottomSheetModal>
	);
}

function SelectOptionItem<T>({
	item,
	selectionMode,
	listState,
	onRequestClose,
}: {
	item: Node<T>;
	selectionMode: "single" | "multiple";
	listState: ListState<T>;
	onRequestClose: () => void;
}) {
	const isSelected = listState.selectionManager.isSelected(item.key);
	const isDisabled = listState.disabledKeys.has(item.key);

	const handlePress = () => {
		if (isDisabled) return;
		if (selectionMode === "multiple") {
			listState.selectionManager.toggleSelection(item.key);
			return;
		}
		listState.selectionManager.select(item.key);
		onRequestClose();
	};

	return (
		<Pressable
			onPress={handlePress}
			disabled={isDisabled}
			accessibilityRole="menuitem"
			accessibilityState={{ selected: isSelected, disabled: isDisabled }}
			className={`flex-row items-center justify-between rounded-md px-3 py-2 ${isDisabled ? "opacity-50" : ""}`}
		>
			<Text className={`text-foreground ${isSelected ? "font-semibold" : ""}`}>
				{item.rendered}
			</Text>
			{isSelected ? (
				<Feather name="check" size={16} color="var(--color-icon-interactive)" />
			) : null}
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
