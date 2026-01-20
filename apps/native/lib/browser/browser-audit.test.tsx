import {
	type BrowserIssue,
	captureConsoleErrors,
	categorizeIssue,
	getMobileViewports,
	prioritizeIssues,
} from "./browser-audit";

describe("browser-audit", () => {
	describe("categorizeIssue", () => {
		it("categorizes React warning as react warning", () => {
			const issue: BrowserIssue = {
				message: "Warning: Each child in a list should have a unique key prop",
				source: "console",
				type: "warn",
				url: "http://localhost:8081",
			};
			const result = categorizeIssue(issue);
			expect(result).toBe("react");
		});

		it("categorizes TypeError as type error", () => {
			const issue: BrowserIssue = {
				message: "TypeError: Cannot read property 'x' of undefined",
				source: "page",
				type: "error",
				url: "http://localhost:8081",
			};
			const result = categorizeIssue(issue);
			expect(result).toBe("type");
		});

		it("categorizes module not found as module error", () => {
			const issue: BrowserIssue = {
				message: "Error: Cannot find module '@/components/Missing'",
				source: "console",
				type: "error",
				url: "http://localhost:8081",
			};
			const result = categorizeIssue(issue);
			expect(result).toBe("module");
		});

		it("categorizes viewport-related issues as viewport", () => {
			const issue: BrowserIssue = {
				message: "Element is not clickable at point (375, 100)",
				source: "console",
				type: "warn",
				url: "http://localhost:8081",
				viewport: { width: 375, height: 667 },
			};
			const result = categorizeIssue(issue);
			expect(result).toBe("viewport");
		});

		it("categorizes layout issues as styling", () => {
			const issue: BrowserIssue = {
				message: "Element overflows container width",
				source: "console",
				type: "warn",
				url: "http://localhost:8081",
				viewport: { width: 390, height: 844 },
			};
			const result = categorizeIssue(issue);
			expect(result).toBe("styling");
		});

		it("categorizes unknown issues as other", () => {
			const issue: BrowserIssue = {
				message: "Something unexpected happened",
				source: "console",
				type: "log",
				url: "http://localhost:8081",
			};
			const result = categorizeIssue(issue);
			expect(result).toBe("other");
		});
	});

	describe("captureConsoleErrors", () => {
		it("captures console.error messages", () => {
			const captured = captureConsoleErrors();
			const _errors: string[] = [];
			captured.onError("Test error message");
			expect(captured.getErrors()).toContainEqual({
				message: "Test error message",
				type: "error",
				timestamp: expect.any(Number),
			});
		});

		it("captures console.warn messages", () => {
			const captured = captureConsoleErrors();
			captured.onWarn("Test warning message");
			expect(captured.getWarnings()).toContainEqual({
				message: "Test warning message",
				type: "warn",
				timestamp: expect.any(Number),
			});
		});

		it("returns all issues sorted by timestamp", () => {
			const captured = captureConsoleErrors();
			captured.onError("First error");
			captured.onWarn("A warning");
			captured.onError("Second error");

			const allIssues = captured.getAllIssues();
			expect(allIssues).toHaveLength(3);
			expect(allIssues[0].message).toBe("First error");
			expect(allIssues[1].message).toBe("A warning");
			expect(allIssues[2].message).toBe("Second error");
		});

		it("clears captured issues", () => {
			const captured = captureConsoleErrors();
			captured.onError("Test error");
			expect(captured.getErrors()).toHaveLength(1);
			captured.clear();
			expect(captured.getErrors()).toHaveLength(0);
		});

		it("counts issues by type", () => {
			const captured = captureConsoleErrors();
			captured.onError("Error 1");
			captured.onError("Error 2");
			captured.onWarn("Warning 1");
			captured.onWarn("Warning 2");
			captured.onWarn("Warning 3");

			const counts = captured.getCounts();
			expect(counts).toEqual({
				errors: 2,
				warnings: 3,
			});
		});
	});

	describe("getMobileViewports", () => {
		it("returns common mobile viewport sizes", () => {
			const viewports = getMobileViewports();
			expect(viewports).toEqual([
				{ name: "iPhone SE", width: 375, height: 667 },
				{ name: "iPhone 12/13/14", width: 390, height: 844 },
				{ name: "iPhone 14 Pro Max", width: 414, height: 896 },
			]);
		});
	});

	describe("prioritizeIssues", () => {
		it("prioritizes errors over warnings", () => {
			const issues: BrowserIssue[] = [
				{
					message: "A warning",
					source: "console",
					type: "warn",
					url: "http://localhost:8081",
				},
				{
					message: "An error",
					source: "page",
					type: "error",
					url: "http://localhost:8081",
				},
			];
			const result = prioritizeIssues(issues);
			expect(result[0].message).toBe("An error");
			expect(result[0].severity).toBe("critical");
			expect(result[1].severity).toBe("medium");
		});

		it("marks React errors as critical severity", () => {
			const issues: BrowserIssue[] = [
				{
					message:
						"Warning: Each child in a list should have a unique key prop",
					source: "console",
					type: "warn",
					url: "http://localhost:8081",
				},
			];
			const result = prioritizeIssues(issues);
			expect(result[0].severity).toBe("high");
		});

		it("marks module not found as critical severity", () => {
			const issues: BrowserIssue[] = [
				{
					message: "Cannot find module '@/components/Missing'",
					source: "console",
					type: "error",
					url: "http://localhost:8081",
				},
			];
			const result = prioritizeIssues(issues);
			expect(result[0].severity).toBe("critical");
		});

		it("groups issues by frequency", () => {
			const issues: BrowserIssue[] = [
				{
					message: "Duplicate key warning",
					source: "console",
					type: "warn",
					url: "http://localhost:8081",
				},
				{
					message: "Duplicate key warning",
					source: "console",
					type: "warn",
					url: "http://localhost:8081",
				},
				{
					message: "Another error",
					source: "page",
					type: "error",
					url: "http://localhost:8081",
				},
			];
			const result = prioritizeIssues(issues);
			const duplicateIssue = result.find(
				(i) => i.message === "Duplicate key warning",
			);
			expect(duplicateIssue?.frequency).toBe(2);
		});

		it("sorts by severity and frequency", () => {
			const issues: BrowserIssue[] = [
				{
					message: "Low priority warning",
					source: "console",
					type: "warn",
					url: "http://localhost:8081",
				},
				{
					message: "Frequent warning",
					source: "console",
					type: "warn",
					url: "http://localhost:8081",
				},
				{
					message: "Frequent warning",
					source: "console",
					type: "warn",
					url: "http://localhost:8081",
				},
				{
					message: "Critical error",
					source: "page",
					type: "error",
					url: "http://localhost:8081",
				},
			];
			const result = prioritizeIssues(issues);
			expect(result[0].severity).toBe("critical");
			expect(result[1].frequency).toBeGreaterThanOrEqual(2);
		});
	});
});
