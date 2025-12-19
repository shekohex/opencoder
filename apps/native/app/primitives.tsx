import { Stack } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { Switch } from "@/components/switch";
import { TextField } from "@/components/text-field";

export default function PrimitivesScreen() {
	const [switch1, setSwitch1] = useState(false);
	const [switch2, setSwitch2] = useState(true);

	return (
		<>
			<Stack.Screen options={{ title: "Primitives Demo" }} />
			<Container>
				<ScrollView contentContainerClassName="p-4 gap-8 pb-10">
					{/* Buttons Section */}
					<View className="gap-4">
						<Text className="font-bold text-foreground text-xl">Buttons</Text>

						<View className="gap-2">
							<Text className="font-semibold text-base text-foreground">
								Variants
							</Text>
							<View className="flex-row flex-wrap gap-2">
								<Button variant="primary">Primary</Button>
								<Button variant="secondary">Secondary</Button>
								<Button variant="ghost">Ghost</Button>
								<Button variant="danger">Danger</Button>
								<Button variant="outline">Outline</Button>
							</View>
						</View>

						<View className="gap-2">
							<Text className="font-semibold text-base text-foreground">
								Sizes
							</Text>
							<View className="flex-row flex-wrap items-center gap-2">
								<Button size="sm">Small</Button>
								<Button size="md">Medium</Button>
								<Button size="lg">Large</Button>
							</View>
						</View>

						<View className="gap-2">
							<Text className="font-semibold text-base text-foreground">
								States
							</Text>
							<View className="flex-row flex-wrap gap-2">
								<Button disabled>Disabled</Button>
								<Button loading>Loading</Button>
								<Button variant="outline" loading>
									Loading
								</Button>
							</View>
						</View>
					</View>

					{/* TextField Section */}
					<View className="gap-4">
						<Text className="font-bold text-foreground text-xl">
							TextFields
						</Text>

						<TextField>
							<TextField.Label>Standard Input</TextField.Label>
							<TextField.Input placeholder="Type something..." />
							<TextField.Description>
								This is a helper text.
							</TextField.Description>
						</TextField>

						<TextField isInvalid>
							<TextField.Label>Error Input</TextField.Label>
							<TextField.Input placeholder="Invalid value" />
							<TextField.ErrorMessage>
								Something went wrong.
							</TextField.ErrorMessage>
						</TextField>

						<TextField isDisabled>
							<TextField.Label>Disabled Input</TextField.Label>
							<TextField.Input placeholder="Cannot type here" />
						</TextField>

						<TextField>
							<TextField.Label>Multiline Input</TextField.Label>
							<TextField.Input
								multiline
								numberOfLines={3}
								className="h-24 py-2"
								placeholder="Type a long message..."
							/>
						</TextField>
					</View>

					{/* Switch Section */}
					<View className="gap-4">
						<Text className="font-bold text-foreground text-xl">Switches</Text>

						<Switch
							checked={switch1}
							onCheckedChange={setSwitch1}
							label="Notifications"
							description="Receive push notifications"
						/>

						<Switch
							checked={switch2}
							onCheckedChange={setSwitch2}
							label="Dark Mode"
						/>

						<Switch
							disabled
							checked={true}
							label="Disabled Checked"
							description="Cannot change this"
						/>

						<Switch disabled checked={false} label="Disabled Unchecked" />
					</View>
				</ScrollView>
			</Container>
		</>
	);
}
