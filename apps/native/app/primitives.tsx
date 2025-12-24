import { Stack } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { Button } from "@/components/button";
import { CodeText } from "@/components/code-text";
import { Container } from "@/components/container";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/dialog";
import { Select } from "@/components/select";
import { Switch } from "@/components/switch";
import { Tabs } from "@/components/tabs";
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

					{/* Dialogs Section */}
					<View className="gap-4">
						<Text className="font-bold text-foreground text-xl">Dialogs</Text>
						<View className="flex-row flex-wrap gap-4">
							<Dialog>
								<DialogTrigger asChild>
									<Button variant="outline">Open Dialog</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Edit Profile</DialogTitle>
										<DialogDescription>
											Make changes to your profile here. Click save when you're
											done.
										</DialogDescription>
									</DialogHeader>
									<View className="gap-4 px-6 py-4">
										<TextField>
											<TextField.Label>Name</TextField.Label>
											<TextField.Input defaultValue="Pedro Duarte" />
										</TextField>
										<TextField>
											<TextField.Label>Username</TextField.Label>
											<TextField.Input defaultValue="@peduarte" />
										</TextField>
									</View>
									<DialogFooter>
										<DialogClose asChild>
											<Button variant="ghost">Cancel</Button>
										</DialogClose>
										<DialogClose asChild>
											<Button>Save changes</Button>
										</DialogClose>
									</DialogFooter>
									<DialogClose />
								</DialogContent>
							</Dialog>

							<Dialog>
								<DialogTrigger asChild>
									<Button variant="danger">Delete Account</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Are you absolutely sure?</DialogTitle>
										<DialogDescription>
											This action cannot be undone. This will permanently delete
											your account and remove your data from our servers.
										</DialogDescription>
									</DialogHeader>
									<DialogFooter>
										<DialogClose asChild>
											<Button variant="ghost">Cancel</Button>
										</DialogClose>
										<DialogClose asChild>
											<Button variant="danger">Yes, delete account</Button>
										</DialogClose>
									</DialogFooter>
								</DialogContent>
							</Dialog>
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

					{/* Select Section */}
					<View className="gap-4">
						<Text className="font-bold text-foreground text-xl">Select</Text>

						<View className="gap-4">
							<Text className="font-semibold text-base text-foreground">
								Single Selection
							</Text>
							<Select placeholder="Pick a theme" label="Theme">
								<Select.Option value="light">Light</Select.Option>
								<Select.Option value="dark">Dark</Select.Option>
								<Select.Option value="system">System</Select.Option>
								<Select.Content />
							</Select>
						</View>

						<View className="gap-4">
							<Text className="font-semibold text-base text-foreground">
								With Default Value
							</Text>
							<Select defaultValue="dark" label="Theme">
								<Select.Option value="light">Light</Select.Option>
								<Select.Option value="dark">Dark</Select.Option>
								<Select.Option value="system">System</Select.Option>
								<Select.Content />
							</Select>
						</View>

						<View className="gap-4">
							<Text className="font-semibold text-base text-foreground">
								Disabled
							</Text>
							<Select placeholder="Cannot select" disabled>
								<Select.Option value="a">Option A</Select.Option>
								<Select.Option value="b">Option B</Select.Option>
								<Select.Content />
							</Select>
						</View>

						<View className="gap-4">
							<Text className="font-semibold text-base text-foreground">
								Multiple Selection
							</Text>
							<Select
								selectionMode="multiple"
								defaultValue={["react"]}
								label="Frameworks"
							>
								<Select.Option value="react">React</Select.Option>
								<Select.Option value="vue">Vue</Select.Option>
								<Select.Option value="angular">Angular</Select.Option>
								<Select.Option value="svelte">Svelte</Select.Option>
								<Select.Content />
							</Select>
						</View>
					</View>

					{/* Tabs Section */}
					<View className="gap-4">
						<Text className="font-bold text-foreground text-xl">Tabs</Text>

						<Tabs defaultValue="account" className="w-full max-w-[400px]">
							<Tabs.List>
								<Tabs.Trigger value="account" className="flex-1">
									Account
								</Tabs.Trigger>
								<Tabs.Trigger value="password" className="flex-1">
									Password
								</Tabs.Trigger>
								<Tabs.Trigger value="settings" className="flex-1">
									Settings
								</Tabs.Trigger>
							</Tabs.List>
							<Tabs.Content value="account">
								<View className="rounded-md border border-border bg-surface-weak p-4">
									<Text className="font-semibold text-foreground text-lg">
										Account
									</Text>
									<Text className="mt-1 text-foreground-weak">
										Make changes to your account here. Click save when you're
										done.
									</Text>
									<View className="mt-4 gap-2">
										<TextField>
											<TextField.Label>Name</TextField.Label>
											<TextField.Input defaultValue="Pedro Duarte" />
										</TextField>
										<TextField>
											<TextField.Label>Username</TextField.Label>
											<TextField.Input defaultValue="@peduarte" />
										</TextField>
									</View>
									<Button className="mt-4 self-end">Save changes</Button>
								</View>
							</Tabs.Content>
							<Tabs.Content value="password">
								<View className="rounded-md border border-border bg-surface-weak p-4">
									<Text className="font-semibold text-foreground text-lg">
										Password
									</Text>
									<Text className="mt-1 text-foreground-weak">
										Change your password here. After saving, you'll be logged
										out.
									</Text>
									<View className="mt-4 gap-2">
										<TextField>
											<TextField.Label>Current Password</TextField.Label>
											<TextField.Input secureTextEntry />
										</TextField>
										<TextField>
											<TextField.Label>New Password</TextField.Label>
											<TextField.Input secureTextEntry />
										</TextField>
									</View>
									<Button className="mt-4 self-end">Save password</Button>
								</View>
							</Tabs.Content>
							<Tabs.Content value="settings">
								<View className="rounded-md border border-border bg-surface-weak p-4">
									<Text className="font-semibold text-foreground text-lg">
										Settings
									</Text>
									<Text className="mt-1 text-foreground-weak">
										Manage your preferences.
									</Text>
									<View className="mt-4">
										<Switch
											checked={switch1}
											onCheckedChange={setSwitch1}
											label="Notifications"
										/>
									</View>
								</View>
							</Tabs.Content>
						</Tabs>
					</View>

					{/* CodeText Section */}
					<View className="gap-4">
						<Text className="font-bold text-foreground text-xl">Code</Text>

						<View className="rounded-md border border-border bg-surface-weak p-4">
							<CodeText className="text-foreground text-sm">
								<Text className="text-foreground-interactive">function</Text>{" "}
								<Text className="text-foreground-success">hello</Text>() {"{"}
								{"\n"} console.
								<Text className="text-foreground-interactive">log</Text>(
								<Text className="text-foreground-warning">"Hello World"</Text>);
								{"\n"}
								{"}"}
							</CodeText>
						</View>

						<View className="gap-2">
							<Text className="font-semibold text-base text-foreground">
								Nerd Fonts (Manual Toggle)
							</Text>
							<View className="rounded-md border border-border bg-surface-weak p-4">
								<CodeText className="text-foreground text-sm" forceNerd>
									With Nerd:    
								</CodeText>
								<CodeText
									className="mt-2 text-foreground text-sm"
									forceNerd={false}
								>
									Without Nerd:    
								</CodeText>
							</View>
						</View>
					</View>
				</ScrollView>
			</Container>
		</>
	);
}
