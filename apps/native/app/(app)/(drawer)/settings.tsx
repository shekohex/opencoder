import { Pressable, ScrollView, Text, View } from "react-native";
import { Container } from "@/components/container";
import { type ThemeModePreference, useTheme } from "@/lib/theme-context";
import { type ThemeName, themeDisplayNames } from "@/lib/themes";

function SettingsSection({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<View className="mb-6">
			<Text className="mb-3 font-semibold text-foreground-strong text-lg">
				{title}
			</Text>
			<View className="gap-2">{children}</View>
		</View>
	);
}

function ThemeOption({
	displayName,
	selected,
	onSelect,
}: {
	name: ThemeName;
	displayName: string;
	selected: boolean;
	onSelect: () => void;
}) {
	return (
		<Pressable
			onPress={onSelect}
			className={`flex-row items-center justify-between rounded-lg border p-4 ${
				selected
					? "border-border-selected bg-surface-interactive"
					: "border-border bg-background"
			}`}
			accessibilityRole="radio"
			accessibilityState={{ checked: selected }}
		>
			<Text className="font-medium text-foreground">{displayName}</Text>
			{selected && (
				<View className="h-5 w-5 items-center justify-center rounded-full bg-icon-interactive">
					<View className="h-2 w-2 rounded-full bg-white" />
				</View>
			)}
		</Pressable>
	);
}

function ModeOption({
	displayName,
	selected,
	onSelect,
}: {
	mode: ThemeModePreference;
	displayName: string;
	selected: boolean;
	onSelect: () => void;
}) {
	return (
		<Pressable
			onPress={onSelect}
			className={`flex-row items-center justify-between rounded-lg border p-4 ${
				selected
					? "border-border-selected bg-surface-interactive"
					: "border-border bg-background"
			}`}
			accessibilityRole="radio"
			accessibilityState={{ checked: selected }}
		>
			<Text className="font-medium text-foreground">{displayName}</Text>
			{selected && (
				<View className="h-5 w-5 items-center justify-center rounded-full bg-icon-interactive">
					<View className="h-2 w-2 rounded-full bg-white" />
				</View>
			)}
		</Pressable>
	);
}

export default function SettingsScreen() {
	const {
		themeName,
		modePreference,
		setThemeName,
		setModePreference,
		availableThemes,
	} = useTheme();

	return (
		<Container>
			<ScrollView className="flex-1 p-4">
				<Text className="mb-6 font-bold text-2xl text-foreground-strong">
					Settings
				</Text>

				<SettingsSection title="Theme">
					{availableThemes.map((name) => (
						<ThemeOption
							key={name}
							name={name}
							displayName={themeDisplayNames[name]}
							selected={themeName === name}
							onSelect={() => setThemeName(name)}
						/>
					))}
				</SettingsSection>

				<SettingsSection title="Appearance">
					<ModeOption
						mode="system"
						displayName="System"
						selected={modePreference === "system"}
						onSelect={() => setModePreference("system")}
					/>
					<ModeOption
						mode="light"
						displayName="Light"
						selected={modePreference === "light"}
						onSelect={() => setModePreference("light")}
					/>
					<ModeOption
						mode="dark"
						displayName="Dark"
						selected={modePreference === "dark"}
						onSelect={() => setModePreference("dark")}
					/>
				</SettingsSection>

				<View className="h-8" />
			</ScrollView>
		</Container>
	);
}
