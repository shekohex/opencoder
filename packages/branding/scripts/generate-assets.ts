import * as fs from "node:fs";
import * as path from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as opentype from "opentype.js";
import { brandColors, colors } from "../src/colors";

const __dirname = dirname(fileURLToPath(import.meta.url));

const FONT_PATH = path.resolve(
	__dirname,
	"../node_modules/@expo-google-fonts/turret-road/800ExtraBold/TurretRoad_800ExtraBold.ttf",
);
const OUTPUT_DIR = path.resolve(__dirname, "..");

async function generateLogo(mode: "light" | "dark") {
	const font = await opentype.load(FONT_PATH);
	const bColors = brandColors[mode];
	const fontSize = 74;
	const textOpen = "open";
	const textCoder = "coder";

	// Measure text to center it
	const openWidth = font.getAdvanceWidth(textOpen, fontSize);
	const coderWidth = font.getAdvanceWidth(textCoder, fontSize);
	const totalWidth = openWidth + coderWidth;

	const startX = (500 - totalWidth) / 2;
	const baseY = 68;

	const openPath = font.getPath(textOpen, startX, baseY, fontSize);
	const coderPath = font.getPath(
		textCoder,
		startX + openWidth,
		baseY,
		fontSize,
	);

	const svg = `
<svg width="500" height="100" viewBox="0 0 500 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="${openPath.toPathData(2)}" fill="${bColors.open}" />
  <path d="${coderPath.toPathData(2)}" fill="${bColors.coder}" />
</svg>
`;

	fs.writeFileSync(
		path.join(OUTPUT_DIR, `opencoder-logo-${mode}.svg`),
		svg.trim(),
	);
	console.log(`Generated opencoder-logo-${mode}.svg`);
}

function generateIcon(mode: "light" | "dark") {
	const bColors = brandColors[mode];
	const svg = `
<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="c">
      <rect width="36" height="36" rx="6" fill="white"/>
    </clipPath>
  </defs>
  <rect x="1" y="1" width="46" height="46" rx="12" fill="${bColors.outer}" />
  <rect x="4" y="4" width="40" height="40" rx="9" fill="${bColors.inner}" />
  <g transform="translate(6, 6)" clip-path="url(#c)">
    <rect width="18" height="18" fill="${colors.highlight}" />
    <rect x="18" y="0" width="18" height="18" fill="${bColors.outer}" />
    <rect x="18" y="18" width="18" height="18" fill="${colors.midGray}" />
    <rect x="0" y="18" width="18" height="18" fill="${colors.darkGray}" />
  </g>
</svg>
`;
	fs.writeFileSync(
		path.join(OUTPUT_DIR, `opencoder-icon-${mode}.svg`),
		svg.trim(),
	);
	console.log(`Generated opencoder-icon-${mode}.svg`);
}

async function main() {
	await generateLogo("light");
	await generateLogo("dark");
	generateIcon("light");
	generateIcon("dark");
}

main().catch(console.error);
