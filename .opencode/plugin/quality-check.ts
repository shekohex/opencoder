import type { Plugin } from "@opencode-ai/plugin";
import { parse, type ParseError } from "jsonc-parser";

const HOOKS_FILE = ".opencode/hooks.jsonc";

type HookConfig = Record<string, string[]>;

type CommandFailure = {
	command: string;
	exitCode: number;
	stdout: string;
	stderr: string;
};

export const QualityCheck: Plugin = async ({ client, $, directory }) => {
	return {
		event: async ({ event }) => {
			if (event.type !== "session.status") return;
			const status = (event as { properties?: { status?: { type?: string } } })
				.properties?.status?.type;
			if (status !== "idle") return;

			const sessionID = (event as { properties?: { sessionID?: string } })
				.properties?.sessionID;
			if (!sessionID) return;

			const lastMessage = await fetchLastMessage(client, sessionID);
			const lastAgent = lastMessage?.info?.agent;
			if (lastAgent === "plan") return;

			const hooks = await readHooksConfig(directory);
			const commands = normalizeCommands(hooks["session.status"]);
			if (!commands.length) return;

			await client.tui.showToast({
				body: {
					message: "Running quality checks...",
					variant: "info",
				},
			});

			const failures: CommandFailure[] = [];
			for (const command of commands) {
				const result = await $.nothrow()`${{ raw: command }}`.quiet();
				if (result.exitCode !== 0) {
					failures.push({
						command,
						exitCode: result.exitCode,
						stdout: result.stdout.toString(),
						stderr: result.stderr.toString(),
					});
				}
			}

			if (!failures.length) return;

			await client.tui.showToast({
				body: {
					message: "Quality checks failed. See session for details.",
					variant: "error",
				},
			});

			const message = renderFailureMessage(failures);
			await client.session.promptAsync({
				path: { id: sessionID },
				body: {
					parts: [
						{
							type: "text",
							text: message,
						},
					],
				},
			});
		},
	};
};

async function fetchLastMessage(
	client: {
		session: {
			messages: (args: { path: { id: string } }) => Promise<unknown>;
		};
	},
	sessionID: string,
) {
	const response = await client.session.messages({ path: { id: sessionID } });
	if (!response || typeof response !== "object" || !("data" in response)) {
		return undefined;
	}
	const data = (response as { data?: unknown }).data;
	if (!Array.isArray(data)) return undefined;
	const messages = data as Array<{ info?: { agent?: string } }>;
	return messages[messages.length - 1];
}

function buildHooksPath(directory: string): string {
	return directory.endsWith("/")
		? `${directory}${HOOKS_FILE}`
		: `${directory}/${HOOKS_FILE}`;
}

async function readHooksConfig(directory: string): Promise<HookConfig> {
	const hooksPath = buildHooksPath(directory);
	try {
		const bun = globalThis as typeof globalThis & {
			Bun?: { file: (path: string) => { text: () => Promise<string> } };
		};
		if (!bun.Bun) return {};
		const content = await bun.Bun.file(hooksPath).text();
		const errors: ParseError[] = [];
		const parsed = parse(content, errors);
		if (errors.length > 0 || !parsed || typeof parsed !== "object") return {};
		return parsed as HookConfig;
	} catch {
		return {};
	}
}

function normalizeCommands(value: unknown): string[] {
	if (!Array.isArray(value)) return [];
	return value
		.filter((command): command is string => typeof command === "string")
		.map((command) => command.trim())
		.filter((command) => command.length > 0);
}

function renderFailureMessage(failures: CommandFailure[]): string {
	const sections = failures
		.map((failure) => {
			const output = formatOutput(failure);
			return `### ${failure.command}\n\nExit code: ${failure.exitCode}\n\n\`\`\`\n${output}\n\`\`\``;
		})
		.join("\n\n");

	return [
		"## Quality checks failed",
		"",
		"Please fix the issues below:",
		"",
		sections,
	].join("\n");
}

function formatOutput(failure: CommandFailure): string {
	const stdout = failure.stdout.trim();
	const stderr = failure.stderr.trim();
	if (!stdout && !stderr) return "(no output)";
	if (stdout && stderr) return `${stdout}\n\n--- stderr ---\n${stderr}`;
	return stdout || stderr;
}
