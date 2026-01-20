import { render } from "@testing-library/react-native";
import { View } from "react-native";

import {
	detectViewportSize,
	getBreakpoint,
	isMobileSize,
	type ViewportSize,
} from "./viewport";

describe("viewport", () => {
	describe("detectViewportSize", () => {
		it("detects iPhone SE (375x667)", () => {
			const result = detectViewportSize(375, 667);
			expect(result).toEqual({
				name: "iPhone SE",
				width: 375,
				height: 667,
				category: "small",
			});
		});

		it("detects iPhone 12/13/14 (390x844)", () => {
			const result = detectViewportSize(390, 844);
			expect(result).toEqual({
				name: "iPhone 12/13/14",
				width: 390,
				height: 844,
				category: "medium",
			});
		});

		it("detects iPhone 14 Pro Max (414x896)", () => {
			const result = detectViewportSize(414, 896);
			expect(result).toEqual({
				name: "iPhone 14 Pro Max",
				width: 414,
				height: 896,
				category: "medium",
			});
		});

		it("detects desktop (1920x1080)", () => {
			const result = detectViewportSize(1920, 1080);
			expect(result).toEqual({
				name: "Desktop",
				width: 1920,
				height: 1080,
				category: "large",
			});
		});

		it("detects tablet (768x1024)", () => {
			const result = detectViewportSize(768, 1024);
			expect(result).toEqual({
				name: "Tablet",
				width: 768,
				height: 1024,
				category: "tablet",
			});
		});
	});

	describe("getBreakpoint", () => {
		it("returns 'sm' for small screens", () => {
			expect(getBreakpoint(375)).toBe("sm");
			expect(getBreakpoint(320)).toBe("sm");
		});

		it("returns 'md' for medium screens", () => {
			expect(getBreakpoint(390)).toBe("md");
			expect(getBreakpoint(414)).toBe("md");
		});

		it("returns 'lg' for large screens", () => {
			expect(getBreakpoint(768)).toBe("lg");
			expect(getBreakpoint(1024)).toBe("lg");
		});

		it("returns 'xl' for extra large screens", () => {
			expect(getBreakpoint(1280)).toBe("xl");
			expect(getBreakpoint(1920)).toBe("xl");
		});
	});

	describe("isMobileSize", () => {
		it("returns true for mobile widths", () => {
			expect(isMobileSize(375)).toBe(true);
			expect(isMobileSize(390)).toBe(true);
			expect(isMobileSize(414)).toBe(true);
		});

		it("returns false for tablet and desktop", () => {
			expect(isMobileSize(768)).toBe(false);
			expect(isMobileSize(1024)).toBe(false);
			expect(isMobileSize(1920)).toBe(false);
		});

		it("returns false for exactly 500px threshold", () => {
			expect(isMobileSize(500)).toBe(false);
		});
	});

	describe("useViewport hook integration", () => {
		it("renders correctly with mobile viewport", () => {
			const TestComponent = ({ size }: { size: ViewportSize }) => {
				const breakpoint = getBreakpoint(size.width);
				const mobile = isMobileSize(size.width);

				return (
					<View>
						<View testID="breakpoint">{breakpoint}</View>
						<View testID="is-mobile">{mobile ? "yes" : "no"}</View>
					</View>
				);
			};

			const { getByTestId } = render(
				<TestComponent
					size={{
						name: "iPhone SE",
						width: 375,
						height: 667,
						category: "small",
					}}
				/>,
			);

			expect(getByTestId("breakpoint").children[0]).toBe("sm");
			expect(getByTestId("is-mobile").children[0]).toBe("yes");
		});

		it("renders correctly with desktop viewport", () => {
			const TestComponent = ({ size }: { size: ViewportSize }) => {
				const breakpoint = getBreakpoint(size.width);
				const mobile = isMobileSize(size.width);

				return (
					<View>
						<View testID="breakpoint">{breakpoint}</View>
						<View testID="is-mobile">{mobile ? "yes" : "no"}</View>
					</View>
				);
			};

			const { getByTestId } = render(
				<TestComponent
					size={{
						name: "Desktop",
						width: 1920,
						height: 1080,
						category: "large",
					}}
				/>,
			);

			expect(getByTestId("breakpoint").children[0]).toBe("xl");
			expect(getByTestId("is-mobile").children[0]).toBe("no");
		});
	});
});
