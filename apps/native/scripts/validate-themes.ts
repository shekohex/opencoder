import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

type Location = {
	filePath: string;
	line: number;
	column: number;
};

type ThemeVariant = {
	name: string;
	filePath: string;
	vars: Map<string, Location[]>;
};

function buildLineIndex(text: string): number[] {
	const starts = [0];
	for (let i = 0; i < text.length; i += 1) {
		if (text[i] === "\n") starts.push(i + 1);
	}
	return starts;
}

function indexToLineCol(
	lineStarts: number[],
	index: number,
): { line: number; column: number } {
	let low = 0;
	let high = lineStarts.length - 1;
	while (low <= high) {
		const mid = (low + high) >> 1;
		const start = lineStarts[mid];
		const next =
			mid + 1 < lineStarts.length
				? lineStarts[mid + 1]
				: Number.POSITIVE_INFINITY;
		if (index < start) {
			high = mid - 1;
			continue;
		}
		if (index >= next) {
			low = mid + 1;
			continue;
		}
		return { line: mid + 1, column: index - start + 1 };
	}
	return { line: 1, column: 1 };
}

function stripComments(css: string): string {
	return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

function findMatchingBrace(text: string, openIndex: number): number {
	let depth = 0;
	for (let i = openIndex; i < text.length; i += 1) {
		const ch = text[i];
		if (ch === "{") depth += 1;
		else if (ch === "}") {
			depth -= 1;
			if (depth === 0) return i;
		}
	}
	return -1;
}

function parseVariantsFromCss(filePath: string): ThemeVariant[] {
	const raw = readFileSync(filePath, "utf8");
	const css = stripComments(raw);
	const lineStarts = buildLineIndex(raw);

	const variants: ThemeVariant[] = [];

	let cursor = 0;
	while (cursor < css.length) {
		const at = css.indexOf("@variant", cursor);
		if (at === -1) break;

		// Parse variant name: @variant <name>
		const nameMatch = /@variant\s+([A-Za-z0-9_-]+)/.exec(css.slice(at));
		if (!nameMatch) {
			cursor = at + 8;
			continue;
		}

		const name = nameMatch[1];
		const afterNameIndex = at + nameMatch[0].length;
		const open = css.indexOf("{", afterNameIndex);
		if (open === -1) {
			cursor = afterNameIndex;
			continue;
		}

		const close = findMatchingBrace(css, open);
		if (close === -1) {
			cursor = open + 1;
			continue;
		}

		const block = css.slice(open + 1, close);
		const vars = new Map<string, Location[]>();

		const declRegex = /(--[A-Za-z0-9_-]+)\s*:/g;
		for (;;) {
			const match = declRegex.exec(block);
			if (!match) break;
			const varName = match[1];

			// location from the original raw text (best-effort)
			const absoluteIndex = raw.indexOf(match[0], at);
			const pos = indexToLineCol(lineStarts, Math.max(0, absoluteIndex));
			const loc: Location = { filePath, line: pos.line, column: pos.column };
			const existing = vars.get(varName) ?? [];
			existing.push(loc);
			vars.set(varName, existing);
		}

		variants.push({ name, filePath, vars });
		cursor = close + 1;
	}

	return variants;
}

function readExtraThemesFromMetroConfig(filePath: string): string[] {
	const text = readFileSync(filePath, "utf8");
	const start = text.indexOf("const extraThemes");
	if (start === -1) return [];
	const open = text.indexOf("[", start);
	const close = text.indexOf("]", open);
	if (open === -1 || close === -1) return [];
	const block = text.slice(open + 1, close);
	return [...block.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

function sortStrings(values: Iterable<string>): string[] {
	return [...values].sort((a, b) => a.localeCompare(b));
}

function formatLoc(loc: Location): string {
	return `${loc.filePath}:${loc.line}:${loc.column}`;
}

function main() {
	const appRoot = resolve(__dirname, "..");
	const themesDir = join(appRoot, "themes");
	const metroConfigPath = join(appRoot, "metro.config.js");

	const themeFiles = readdirSync(themesDir)
		.filter((name) => name.endsWith(".css"))
		.map((name) => join(themesDir, name));

	const variants = themeFiles.flatMap(parseVariantsFromCss);
	const byName = new Map<string, ThemeVariant>();
	for (const variant of variants) byName.set(variant.name, variant);

	const errors: string[] = [];
	const warnings: string[] = [];

	function pushError(message: string) {
		errors.push(message);
	}

	function pushWarning(message: string) {
		warnings.push(message);
	}

	function formatVarList(vars: string[], max = 12): string {
		if (vars.length <= max) return vars.join(", ");
		return `${vars.slice(0, max).join(", ")}, … (+${vars.length - max} more)`;
	}

	function formatVariantHeader(variant: ThemeVariant): string {
		return `Variant '${variant.name}' (${variant.filePath})`;
	}

	const requiredBaseVariants = ["light", "dark"] as const;
	for (const name of requiredBaseVariants) {
		if (!byName.has(name)) {
			pushError(
				`Missing required base theme variant '@variant ${name}'.\n` +
					`Fix: define '@variant ${name} { ... }' in 'apps/native/themes/opencode.css'.`,
			);
		}
	}

	const light = byName.get("light");
	if (!light) {
		console.error("Theme validation failed.\n");
		console.error(errors.map((e, i) => `[${i + 1}] ${e}`).join("\n\n"));
		process.exit(1);
	}

	const baselineVars = new Set(light.vars.keys());
	if (baselineVars.size === 0) {
		pushError(
			`Baseline theme '@variant light' has no CSS variables.\n` +
				`Fix: ensure 'apps/native/themes/opencode.css' defines the full variable set in '@variant light'.`,
		);
	}

	// Ensure dark matches baseline
	const dark = byName.get("dark");
	if (dark) {
		const darkVars = new Set(dark.vars.keys());
		const missing = sortStrings(
			[...baselineVars].filter((v) => !darkVars.has(v)),
		);
		const extra = sortStrings(
			[...darkVars].filter((v) => !baselineVars.has(v)),
		);
		if (missing.length || extra.length) {
			pushError(
				`${formatVariantHeader(dark)} does not match baseline '@variant light'.\n` +
					`Missing (${missing.length}): ${formatVarList(missing)}\n` +
					`Extra (${extra.length}): ${formatVarList(extra)}\n` +
					"Fix: update the variant to define the same variable set as '@variant light'.",
			);
		}
	}

	for (const variant of variants) {
		const declared = new Set(variant.vars.keys());
		const missing = sortStrings(
			[...baselineVars].filter((v) => !declared.has(v)),
		);
		const extra = sortStrings(
			[...declared].filter((v) => !baselineVars.has(v)),
		);

		if (missing.length || extra.length) {
			pushError(
				`${formatVariantHeader(variant)} does not match baseline '@variant light'.\n` +
					`Missing (${missing.length}): ${formatVarList(missing)}\n` +
					`Extra (${extra.length}): ${formatVarList(extra)}\n` +
					"Fix: every theme variant must define the exact same variables as '@variant light'.",
			);
		}

		for (const [varName, locs] of variant.vars) {
			if (locs.length > 1) {
				pushWarning(
					`${formatVariantHeader(variant)} declares '${varName}' multiple times.\n` +
						`Locations: ${locs.map(formatLoc).join(", ")}`,
				);
			}
		}
	}

	// Ensure metro.config.js extraThemes exist as variants
	const extraThemes = readExtraThemesFromMetroConfig(metroConfigPath);
	for (const themeName of extraThemes) {
		if (!byName.has(themeName)) {
			pushError(
				`Theme '${themeName}' is registered in 'apps/native/metro.config.js' (extraThemes) but is missing from CSS.\n` +
					`Fix: add '@variant ${themeName} { ... }' to a file under 'apps/native/themes/', or remove it from extraThemes.`,
			);
		}
	}

	// Ensure no "forgotten" custom variants (excluding base light/dark)
	const definedCustom = sortStrings(
		[...byName.keys()].filter(
			(n) =>
				!requiredBaseVariants.includes(
					n as (typeof requiredBaseVariants)[number],
				),
		),
	);
	const registeredCustom = new Set(extraThemes);
	for (const customName of definedCustom) {
		const isBuiltIn = customName === "light" || customName === "dark";
		if (!isBuiltIn && !registeredCustom.has(customName)) {
			pushWarning(
				`Theme '${customName}' is defined in CSS but not registered in 'apps/native/metro.config.js' (extraThemes).\n` +
					"Fix: add it to extraThemes (and restart Metro) if you want to use it on native.",
			);
		}
	}

	const baselineSummary = `Baseline: '@variant light' (${light.filePath}) with ${baselineVars.size} variables.`;

	if (errors.length) {
		console.error("Theme validation failed.\n");
		console.error(`${baselineSummary}\n`);
		console.error(errors.map((e, i) => `[#${i + 1}] ${e}`).join("\n\n"));

		if (warnings.length) {
			console.warn("\nWarnings:\n");
			console.warn(warnings.map((w) => `- ${w}`).join("\n"));
		}

		process.exit(1);
	}

	if (warnings.length) {
		console.warn("Warnings:\n");
		console.warn(warnings.map((w) => `- ${w}`).join("\n"));
	}

	console.log(
		JSON.stringify(
			{
				status: "ok",
				baselineVariableCount: baselineVars.size,
				variantCount: variants.length,
				extraThemes,
			},
			null,
			2,
		),
	);
}

main();
