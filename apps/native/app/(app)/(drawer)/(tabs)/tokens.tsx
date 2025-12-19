import { ScrollView, Text, View } from "react-native";
import { Container } from "@/components/container";

function ColorSwatch({
	name,
	colorClass,
}: {
	name: string;
	colorClass: string;
}) {
	return (
		<View className="flex-row items-center gap-3 py-2">
			<View
				className={`h-12 w-12 rounded-lg ${colorClass} border border-border`}
			/>
			<Text className="font-medium text-foreground text-sm">{name}</Text>
		</View>
	);
}

function Section({
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
			{children}
		</View>
	);
}

function RadiusSwatch({
	name,
	radiusClass,
}: {
	name: string;
	radiusClass: string;
}) {
	return (
		<View className="flex-row items-center gap-3 py-2">
			<View
				className={`h-16 w-16 border border-border-interactive bg-surface-interactive ${radiusClass}`}
			/>
			<Text className="font-medium text-foreground text-sm">{name}</Text>
		</View>
	);
}

export default function TokensScreen() {
	return (
		<Container>
			<ScrollView className="flex-1 p-4">
				<Text className="mb-6 font-bold text-2xl text-foreground-strong">
					Design Tokens
				</Text>

				<Section title="Background Colors">
					<ColorSwatch name="background" colorClass="bg-background" />
					<ColorSwatch name="background-weak" colorClass="bg-background-weak" />
					<ColorSwatch
						name="background-strong"
						colorClass="bg-background-strong"
					/>
					<ColorSwatch
						name="background-stronger"
						colorClass="bg-background-stronger"
					/>
				</Section>

				<Section title="Surface Colors">
					<ColorSwatch name="surface" colorClass="bg-surface" />
					<ColorSwatch name="surface-weak" colorClass="bg-surface-weak" />
					<ColorSwatch name="surface-strong" colorClass="bg-surface-strong" />
					<ColorSwatch name="surface-brand" colorClass="bg-surface-brand" />
					<ColorSwatch
						name="surface-interactive"
						colorClass="bg-surface-interactive"
					/>
					<ColorSwatch name="surface-success" colorClass="bg-surface-success" />
					<ColorSwatch name="surface-warning" colorClass="bg-surface-warning" />
					<ColorSwatch
						name="surface-critical"
						colorClass="bg-surface-critical"
					/>
					<ColorSwatch name="surface-info" colorClass="bg-surface-info" />
				</Section>

				<Section title="Text Colors">
					<View className="rounded-lg bg-background-weak p-3">
						<Text className="mb-1 text-foreground">foreground (base)</Text>
						<Text className="mb-1 text-foreground-weak">foreground-weak</Text>
						<Text className="mb-1 text-foreground-weaker">
							foreground-weaker
						</Text>
						<Text className="mb-1 text-foreground-strong">
							foreground-strong
						</Text>
						<Text className="mb-1 text-foreground-interactive">
							foreground-interactive
						</Text>
						<Text className="mb-1 text-foreground-success">
							foreground-success
						</Text>
						<Text className="mb-1 text-foreground-critical">
							foreground-critical
						</Text>
						<Text className="text-foreground-warning">foreground-warning</Text>
					</View>
				</Section>

				<Section title="Border Colors">
					<View className="flex-row flex-wrap gap-2">
						<View className="h-16 w-16 rounded-md border-2 border-border bg-background" />
						<View className="h-16 w-16 rounded-md border-2 border-border-weak bg-background" />
						<View className="h-16 w-16 rounded-md border-2 border-border-strong bg-background" />
						<View className="h-16 w-16 rounded-md border-2 border-border-selected bg-background" />
						<View className="h-16 w-16 rounded-md border-2 border-border-success bg-background" />
						<View className="h-16 w-16 rounded-md border-2 border-border-warning bg-background" />
						<View className="h-16 w-16 rounded-md border-2 border-border-critical bg-background" />
						<View className="h-16 w-16 rounded-md border-2 border-border-info bg-background" />
					</View>
					<View className="mt-2 flex-row flex-wrap gap-2">
						<Text className="w-16 text-center text-foreground-weak text-xs">
							base
						</Text>
						<Text className="w-16 text-center text-foreground-weak text-xs">
							weak
						</Text>
						<Text className="w-16 text-center text-foreground-weak text-xs">
							strong
						</Text>
						<Text className="w-16 text-center text-foreground-weak text-xs">
							selected
						</Text>
						<Text className="w-16 text-center text-foreground-weak text-xs">
							success
						</Text>
						<Text className="w-16 text-center text-foreground-weak text-xs">
							warning
						</Text>
						<Text className="w-16 text-center text-foreground-weak text-xs">
							critical
						</Text>
						<Text className="w-16 text-center text-foreground-weak text-xs">
							info
						</Text>
					</View>
				</Section>

				<Section title="Smoke Palette">
					<View className="flex-row flex-wrap gap-1">
						{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
							<View
								key={n}
								className={`h-10 w-10 rounded bg-smoke-${n} border border-border`}
							/>
						))}
					</View>
					<View className="mt-1 flex-row flex-wrap gap-1">
						{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
							<Text
								key={n}
								className="w-10 text-center text-foreground-weak text-xs"
							>
								{n}
							</Text>
						))}
					</View>
				</Section>

				<Section title="Border Radius">
					<View className="flex-row flex-wrap gap-4">
						<RadiusSwatch name="xs (2px)" radiusClass="rounded-xs" />
						<RadiusSwatch name="sm (4px)" radiusClass="rounded-sm" />
						<RadiusSwatch name="md (6px)" radiusClass="rounded-md" />
						<RadiusSwatch name="lg (8px)" radiusClass="rounded-lg" />
						<RadiusSwatch name="xl (10px)" radiusClass="rounded-xl" />
					</View>
				</Section>

				<Section title="Input States">
					<ColorSwatch name="input (base)" colorClass="bg-input" />
					<ColorSwatch name="input-hover" colorClass="bg-input-hover" />
					<ColorSwatch name="input-active" colorClass="bg-input-active" />
					<ColorSwatch name="input-selected" colorClass="bg-input-selected" />
					<ColorSwatch name="input-disabled" colorClass="bg-input-disabled" />
				</Section>

				<View className="h-8" />
			</ScrollView>
		</Container>
	);
}
