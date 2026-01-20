export type BrowserIssue = {
	message: string;
	source: string;
	type: string;
	url: string;
	viewport?: { width: number; height: number };
	severity?: string;
	frequency?: number;
	timestamp?: number;
};

type ConsoleEntry = {
	message: string;
	type: string;
	timestamp: number;
};

type CapturedConsole = {
	onError: (msg: string) => void;
	onWarn: (msg: string) => void;
	getErrors: () => ConsoleEntry[];
	getWarnings: () => ConsoleEntry[];
	getAllIssues: () => ConsoleEntry[];
	clear: () => void;
	getCounts: () => { errors: number; warnings: number };
};

let _errors: ConsoleEntry[] = [];
let _warnings: ConsoleEntry[] = [];

export function categorizeIssue(issue: BrowserIssue): string {
	const msg = issue.message.toLowerCase();

	if (msg.includes("warning:")) return "react";
	if (msg.includes("typeerror:")) return "type";
	if (msg.includes("cannot find module")) return "module";
	if (issue.viewport?.width === 375 || issue.viewport?.width === 390) {
		if (msg.includes("clickable")) return "viewport";
	}
	if (msg.includes("overflow")) return "styling";
	return "other";
}

export function captureConsoleErrors(): CapturedConsole {
	_errors = [];
	_warnings = [];
	let _counter = 0;

	return {
		onError: (msg: string) => {
			_errors.push({ message: msg, type: "error", timestamp: _counter++ });
		},
		onWarn: (msg: string) => {
			_warnings.push({ message: msg, type: "warn", timestamp: _counter++ });
		},
		getErrors: () => _errors,
		getWarnings: () => _warnings,
		getAllIssues: () =>
			[..._errors, ..._warnings].sort((a, b) => a.timestamp - b.timestamp),
		clear: () => {
			_errors = [];
			_warnings = [];
		},
		getCounts: () => ({
			errors: _errors.length,
			warnings: _warnings.length,
		}),
	};
}

export function getMobileViewports() {
	return [
		{ name: "iPhone SE", width: 375, height: 667 },
		{ name: "iPhone 12/13/14", width: 390, height: 844 },
		{ name: "iPhone 14 Pro Max", width: 414, height: 896 },
	];
}

export function prioritizeIssues(
	issues: BrowserIssue[],
): (BrowserIssue & { severity: string; frequency: number })[] {
	const freq: Record<string, number> = {};
	for (const i of issues) {
		freq[i.message] = (freq[i.message] || 0) + 1;
	}

	const withPriority = issues.map((i) => {
		const category = categorizeIssue(i);
		let severity = "low";
		if (i.type === "error" || category === "module") severity = "critical";
		else if (category === "react") severity = "high";
		else if (i.type === "warn") severity = "medium";

		return { ...i, severity, frequency: freq[i.message] || 1 };
	});

	const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
	return withPriority.sort((a, b) => {
		if (a.severity !== b.severity) {
			return (
				severityOrder[a.severity as keyof typeof severityOrder] -
				severityOrder[b.severity as keyof typeof severityOrder]
			);
		}
		return b.frequency - a.frequency;
	});
}
