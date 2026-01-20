import { render } from "@testing-library/react-native";
import type { FilePart } from "@/domain/types";
import { FilePartComponent } from "../FilePart";

describe("FilePartComponent", () => {
	const createFilePart = (
		filename: string,
		mime = "text/plain",
		url = "https://example.com/file.txt",
	): FilePart => ({
		id: "part-1",
		sessionID: "session-1",
		messageID: "message-1",
		type: "file",
		mime,
		filename,
		url,
	});

	it("renders file name and icon", () => {
		const part = createFilePart("test.txt");
		const { getByText, getByTestId } = render(
			<FilePartComponent part={part} messageId="message-1" />,
		);

		expect(getByTestId("file-part")).toBeTruthy();
		expect(getByText("test.txt")).toBeTruthy();
	});

	it("shows different icons for image files", () => {
		const part = createFilePart("photo.png", "image/png");
		const { getByTestId } = render(
			<FilePartComponent part={part} messageId="message-1" />,
		);

		expect(getByTestId("file-icon-image")).toBeTruthy();
	});

	it("shows code icon for code files", () => {
		const part = createFilePart("script.ts", "text/typescript");
		const { getByTestId } = render(
			<FilePartComponent part={part} messageId="message-1" />,
		);

		expect(getByTestId("file-icon-code")).toBeTruthy();
	});

	it("shows generic file icon for unknown types", () => {
		const part = createFilePart("data.bin", "application/octet-stream");
		const { getByTestId } = render(
			<FilePartComponent part={part} messageId="message-1" />,
		);

		expect(getByTestId("file-icon-generic")).toBeTruthy();
	});

	it("handles files without filename", () => {
		const part = createFilePart("", "text/plain");
		const { getByText } = render(
			<FilePartComponent part={part} messageId="message-1" />,
		);

		expect(getByText(/Untitled/)).toBeTruthy();
	});
});
