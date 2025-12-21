import { Pressable, ScrollView, Text, View } from "react-native";
import { AppText } from "@/components/app-text";
import { CodeText } from "@/components/code-text";
import { Container } from "@/components/container";
import { Switch } from "@/components/switch";
import { useFontsConfig } from "@/lib/font-context";
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

function FontOption({
	label,
	selected,
	onSelect,
}: {
	label: string;
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
			<AppText className="font-medium text-foreground">{label}</AppText>
			{selected && (
				<View className="h-5 w-5 items-center justify-center rounded-full bg-icon-interactive">
					<View className="h-2 w-2 rounded-full bg-white" />
				</View>
			)}
		</Pressable>
	);
}

function FontPreview() {
	return (
		<View className="gap-2 rounded-lg border border-border bg-surface p-4">
			<AppText className="font-bold text-foreground-strong text-xl">
				The quick brown fox jumps over the lazy dog.
			</AppText>
			<AppText className="font-normal text-base text-foreground">
				The quick brown fox jumps over the lazy dog.
			</AppText>
			<AppText className="font-light text-foreground-weak text-sm">
				The quick brown fox jumps over the lazy dog.
			</AppText>
			<View className="mt-2 rounded bg-surface-weak p-2">
				<CodeText className="text-foreground text-sm">
					const greet = (name: string) ={">"} `Hello ${"{"}name{"}"}`;
				</CodeText>
				<CodeText className="mt-1 text-foreground text-sm">
					{/* Nerd Font Check:     */}
					Nerd Font Check:    
				</CodeText>
			</View>
		</View>
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

	const {
		sansSet,
		monoSet,
		setSansSet,
		setMonoSet,
		setMonoFlavor,
		isNerdEnabled,
	} = useFontsConfig();

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

				<SettingsSection title="Fonts">
					<View className="gap-4">
						<View className="gap-2">
							<AppText className="font-semibold text-foreground-strong text-sm">
								Sans Serif
							</AppText>
							<FontOption
								label="Inter"
								selected={sansSet === "Inter"}
								onSelect={() => setSansSet("Inter")}
							/>
							<FontOption
								label="Manrope"
								selected={sansSet === "Manrope"}
								onSelect={() => setSansSet("Manrope")}
							/>
						</View>

						<View className="gap-2">
							<AppText className="font-semibold text-foreground-strong text-sm">
								Monospace
							</AppText>
							<FontOption
								label="IBM Plex Mono"
								selected={monoSet === "IBMPlexMono"}
								onSelect={() => setMonoSet("IBMPlexMono")}
							/>
							<FontOption
								label="JetBrains Mono"
								selected={monoSet === "JetBrainsMono"}
								onSelect={() => setMonoSet("JetBrainsMono")}
							/>
						</View>

						<View className="flex-row items-center justify-between py-2">
							<View>
								<AppText className="font-medium text-foreground">
									Nerd Fonts
								</AppText>
								<AppText className="font-light text-foreground-weak text-sm">
									Show developer icons in code/terminal
								</AppText>
							</View>
							<Switch
								checked={isNerdEnabled}
								onCheckedChange={(val) =>
									setMonoFlavor(val ? "nerd" : "normal")
								}
							/>
						</View>

						<View className="gap-2">
							<AppText className="font-semibold text-foreground-strong text-sm">
								Preview
							</AppText>
							<FontPreview />
						</View>
					</View>
				</SettingsSection>

				<View className="h-8" />
			</ScrollView>
		</Container>
	);
}
