import { render } from "@testing-library/react-native";
import { Redirect } from "expo-router";
import { useSession } from "@/lib/auth";
import AppLayout from "../../app/(app)/_layout";

// Mock dependencies
jest.mock("@/lib/auth", () => ({
	useSession: jest.fn(),
}));

jest.mock("expo-router", () => ({
	Redirect: jest.fn(() => null),
	Stack: jest.fn(() => null),
}));

describe("AppLayout", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("shows loading state", () => {
		(useSession as jest.Mock).mockReturnValue({ isLoading: true });

		const { getByText } = render(<AppLayout />);
		expect(getByText("Loading...")).toBeTruthy();
	});

	it("redirects to sign-in if no session", () => {
		(useSession as jest.Mock).mockReturnValue({
			isLoading: false,
			session: null,
		});

		render(<AppLayout />);
		expect(Redirect).toHaveBeenCalledWith({ href: "/sign-in" }, undefined);
	});

	it("renders stack if authenticated", () => {
		(useSession as jest.Mock).mockReturnValue({
			isLoading: false,
			session: "token",
		});

		render(<AppLayout />);
		const { Stack } = require("expo-router");
		expect(Stack).toHaveBeenCalled();
	});
});
