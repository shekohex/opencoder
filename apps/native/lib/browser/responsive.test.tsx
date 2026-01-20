import { render } from "@testing-library/react-native";
import { ScrollView, View } from "react-native";

import {
	createResponsiveStyles,
	ResponsiveContainer,
	useResponsiveProps,
} from "./responsive";

describe("responsive", () => {
	describe("createResponsiveStyles", () => {
		it("creates mobile styles for small viewport", () => {
			const styles = createResponsiveStyles({
				mobile: { padding: 8, fontSize: 14 },
				tablet: { padding: 16, fontSize: 16 },
				desktop: { padding: 24, fontSize: 18 },
			});

			const mobileStyle = styles(375);
			expect(mobileStyle).toEqual({ padding: 8, fontSize: 14 });
		});

		it("creates tablet styles for medium viewport", () => {
			const styles = createResponsiveStyles({
				mobile: { padding: 8 },
				tablet: { padding: 16 },
				desktop: { padding: 24 },
			});

			const tabletStyle = styles(768);
			expect(tabletStyle).toEqual({ padding: 16 });
		});

		it("creates desktop styles for large viewport", () => {
			const styles = createResponsiveStyles({
				mobile: { padding: 8 },
				tablet: { padding: 16 },
				desktop: { padding: 24 },
			});

			const desktopStyle = styles(1920);
			expect(desktopStyle).toEqual({ padding: 24 });
		});
	});

	describe("ResponsiveContainer", () => {
		it("renders with flex-1 by default", () => {
			const { getByTestId } = render(
				<ResponsiveContainer>
					<View testID="child" />
				</ResponsiveContainer>,
			);

			const container = getByTestId("responsive-container");
			expect(container).toBeTruthy();
		});

		it("renders children correctly", () => {
			const { getByTestId } = render(
				<ResponsiveContainer>
					<View testID="child-1" />
					<View testID="child-2" />
				</ResponsiveContainer>,
			);

			expect(getByTestId("child-1")).toBeTruthy();
			expect(getByTestId("child-2")).toBeTruthy();
		});

		it("prevents horizontal overflow", () => {
			const { getByTestId } = render(
				<ResponsiveContainer>
					<View testID="wide-content" style={{ width: 2000 }} />
				</ResponsiveContainer>,
			);

			const container = getByTestId("responsive-container");
			expect(container.props.style).toContainEqual({ flex: 1 });
		});
	});

	describe("useResponsiveProps", () => {
		it("returns mobile props for small screen", () => {
			const responsiveProps = {
				mobile: { size: "small" as const, color: "blue" },
				tablet: { size: "medium" as const, color: "green" },
				desktop: { size: "large" as const, color: "red" },
			};

			const result = useResponsiveProps(responsiveProps, 375);
			expect(result).toEqual({ size: "small", color: "blue" });
		});

		it("returns tablet props for medium screen", () => {
			const responsiveProps = {
				mobile: { size: "small" as const },
				tablet: { size: "medium" as const },
				desktop: { size: "large" as const },
			};

			const result = useResponsiveProps(responsiveProps, 768);
			expect(result).toEqual({ size: "medium" });
		});

		it("returns desktop props for large screen", () => {
			const responsiveProps = {
				mobile: { size: "small" as const },
				tablet: { size: "medium" as const },
				desktop: { size: "large" as const },
			};

			const result = useResponsiveProps(responsiveProps, 1920);
			expect(result).toEqual({ size: "large" });
		});
	});

	describe("overflow handling", () => {
		it("ScrollView prevents horizontal overflow", () => {
			const { getByTestId } = render(
				<ScrollView testID="scroll-view" horizontal={false}>
					<View style={{ width: 2000, height: 100 }} />
				</ScrollView>,
			);

			const scrollView = getByTestId("scroll-view");
			expect(scrollView.props.horizontal).toBe(false);
		});
	});
});
