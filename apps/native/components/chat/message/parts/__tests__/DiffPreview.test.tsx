import { fireEvent, render } from "@testing-library/react-native";
import type { PatchPart } from "@/domain/types";
import { DiffPreview } from "../DiffPreview";

describe("DiffPreview", () => {
	const createPatchPart = (files: string[], hash = "abc123"): PatchPart => ({
		id: "part-1",
		sessionID: "session-1",
		messageID: "message-1",
		type: "patch",
		hash,
		files,
	});

	it("renders list of changed files", () => {
		const part = createPatchPart(["src/app.tsx", "src/utils.ts"]);
		const { getByText, getByTestId } = render(
			<DiffPreview part={part} messageId="message-1" />,
		);

		expect(getByTestId("diff-preview")).toBeTruthy();
		expect(getByText("src/app.tsx")).toBeTruthy();
		expect(getByText("src/utils.ts")).toBeTruthy();
	});

	it("shows file count badge", () => {
		const part = createPatchPart(["a.txt", "b.txt", "c.txt"]);
		const { getByText } = render(
			<DiffPreview part={part} messageId="message-1" />,
		);

		expect(getByText(/3 files/)).toBeTruthy();
	});

	it("displays single file singular", () => {
		const part = createPatchPart(["src/main.ts"]);
		const { getByText } = render(
			<DiffPreview part={part} messageId="message-1" />,
		);

		expect(getByText(/1 file/)).toBeTruthy();
	});

	it("collapses file list by default when many files", () => {
		const files = Array.from({ length: 10 }, (_, i) => `src/file${i}.ts`);
		const part = createPatchPart(files);
		const { getByTestId, queryByText } = render(
			<DiffPreview part={part} messageId="message-1" />,
		);

		expect(getByTestId("diff-preview")).toBeTruthy();
		expect(queryByText("src/file9.ts")).toBeNull();
	});

	it("expands when show all is tapped", () => {
		const files = Array.from({ length: 10 }, (_, i) => `src/file${i}.ts`);
		const part = createPatchPart(files);
		const { getByTestId, getByText, queryByText } = render(
			<DiffPreview part={part} messageId="message-1" />,
		);

		expect(queryByText("src/file9.ts")).toBeNull();

		const expandBtn = getByTestId("diff-expand");
		fireEvent.press(expandBtn);

		expect(getByText("src/file9.ts")).toBeTruthy();
	});

	it("shows patch hash", () => {
		const part = createPatchPart(["test.ts"], "def456");
		const { getByText } = render(
			<DiffPreview part={part} messageId="message-1" />,
		);

		expect(getByText(/def456/)).toBeTruthy();
	});

	it("displays file extension icons", () => {
		const part = createPatchPart(["src/image.png", "src/code.ts"]);
		const { getByTestId } = render(
			<DiffPreview part={part} messageId="message-1" />,
		);

		expect(getByTestId("file-icon-ts")).toBeTruthy();
	});

	it("handles empty file list", () => {
		const part = createPatchPart([]);
		const { getByText } = render(
			<DiffPreview part={part} messageId="message-1" />,
		);

		expect(getByText(/No files/)).toBeTruthy();
	});

	it("groups files by directory", () => {
		const part = createPatchPart([
			"src/components/A.tsx",
			"src/components/B.tsx",
			"src/utils/C.ts",
		]);
		const { getByText } = render(
			<DiffPreview part={part} messageId="message-1" />,
		);

		expect(getByText("src/components")).toBeTruthy();
		expect(getByText("src/utils")).toBeTruthy();
	});
});
