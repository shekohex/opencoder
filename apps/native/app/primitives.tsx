import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { Accordion } from "@/components/accordion";
import { Button } from "@/components/button";
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
import { TextField } from "@/components/text-field";

export default function PrimitivesScreen() {
	const [switch1, setSwitch1] = useState(false);
	const [switch2, setSwitch2] = useState(true);
	const [switch3, setSwitch3] = useState(false);

	return (
		<ScrollView className="flex-1 bg-background">
			<View className="gap-6 p-6">
				<View className="gap-4">
					<Text className="font-bold text-foreground text-xl">Buttons</Text>
					<View className="gap-4">
						<Text className="text-foreground-weak">Variants</Text>
						<View className="flex-row flex-wrap gap-4">
							<Button>Primary</Button>
							<Button variant="secondary">Secondary</Button>
							<Button variant="ghost">Ghost</Button>
							<Button variant="danger">Danger</Button>
							<Button variant="outline">Outline</Button>
						</View>
					</View>
					<View className="gap-4">
						<Text className="text-foreground-weak">Sizes</Text>
						<View className="flex-row flex-wrap gap-4">
							<Button size="sm">Small</Button>
							<Button size="md">Medium</Button>
							<Button size="lg">Large</Button>
						</View>
					</View>
					<View className="gap-4">
						<Text className="text-foreground-weak">States</Text>
						<View className="flex-row flex-wrap gap-4">
							<Button disabled>Disabled</Button>
							<Button loading>Loading</Button>
							<Button variant="outline" loading>
								Loading
							</Button>
						</View>
					</View>
				</View>

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
								<View className="gap-4 py-4">
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

						<Dialog variant="alert">
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
									<DialogClose asChild style="cancel">
										<Button variant="ghost">Cancel</Button>
									</DialogClose>
									<DialogClose asChild style="destructive">
										<Button variant="danger">Yes</Button>
									</DialogClose>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</View>
				</View>

				<View className="gap-4">
					<Text className="font-bold text-foreground text-xl">TextFields</Text>

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
						description="Use dark theme"
					/>

					<Switch
						checked={switch3}
						onCheckedChange={setSwitch3}
						label="Auto Updates"
						description="Update automatically"
					/>
				</View>

				<View className="gap-4">
					<Text className="font-bold text-foreground text-xl">Selects</Text>

					<Select placeholder="Pick a theme" label="Theme">
						<Select.Option value="light">Light</Select.Option>
						<Select.Option value="dark">Dark</Select.Option>
						<Select.Option value="system">System</Select.Option>
						<Select.Content />
					</Select>

					<Select defaultValue="dark" label="Theme">
						<Select.Option value="light">Light</Select.Option>
						<Select.Option value="dark">Dark</Select.Option>
						<Select.Option value="system">System</Select.Option>
						<Select.Content />
					</Select>

					<Select placeholder="Cannot select" disabled>
						<Select.Option value="a">Option A</Select.Option>
						<Select.Option value="b">Option B</Select.Option>
						<Select.Content />
					</Select>

					<Select
						label="Favorite frameworks"
						selectionMode="multiple"
						defaultValue={["react", "vue"]}
					>
						<Select.Option value="react">React</Select.Option>
						<Select.Option value="vue">Vue</Select.Option>
						<Select.Option value="angular">Angular</Select.Option>
						<Select.Option value="svelte">Svelte</Select.Option>
						<Select.Content />
					</Select>
				</View>

				<View className="gap-4">
					<Text className="font-bold text-foreground text-xl">Accordion</Text>
					<Accordion
						type="single"
						collapsible
						showDividers
						className="rounded-lg border border-border"
					>
						<Accordion.Item value="item-1">
							<Accordion.Trigger>
								<Text className="text-foreground text-sm">
									Workspace details
								</Text>
								<Accordion.Indicator />
							</Accordion.Trigger>
							<Accordion.Content>
								<Text className="text-foreground-weak text-sm">
									Active workspace shows projects and sessions.
								</Text>
							</Accordion.Content>
						</Accordion.Item>
						<Accordion.Item value="item-2">
							<Accordion.Trigger>
								<Text className="text-foreground text-sm">Session rules</Text>
								<Accordion.Indicator />
							</Accordion.Trigger>
							<Accordion.Content>
								<Text className="text-foreground-weak text-sm">
									Sessions sync across devices and reopen quickly.
								</Text>
							</Accordion.Content>
						</Accordion.Item>
					</Accordion>
				</View>

				<View className="gap-4">
					<Text className="font-bold text-foreground text-xl">Badges</Text>

					<View className="flex-row flex-wrap gap-4">
						<View className="flex-row items-center gap-2 rounded-full bg-surface px-3 py-1">
							<Feather name="bell" size={14} color="var(--color-icon)" />
							<Text className="text-foreground text-sm">Notifications</Text>
						</View>
						<View className="flex-row items-center gap-2 rounded-full bg-surface px-3 py-1">
							<Text className="text-foreground text-sm">Badge</Text>
						</View>
						<View className="flex-row items-center gap-2 rounded-full bg-surface px-3 py-1">
							<Text className="text-foreground text-sm">Badge with icon</Text>
						</View>
					</View>
				</View>
			</View>
		</ScrollView>
	);
}
