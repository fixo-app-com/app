import { render, screen } from "@testing-library/react-native";
import VerifyEmailScreen from "./VerifyEmailScreen";

// Mock the AuthContext
jest.mock("../../../contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { email: "test@example.com", emailVerified: false },
    reloadUser: jest.fn(),
  }),
}));

describe("VerifyEmailScreen", () => {
  it("renders the brand name", () => {
    render(<VerifyEmailScreen />);
    expect(screen.getByText("FIXO")).toBeOnTheScreen();
  });

  it("renders verify email heading", () => {
    render(<VerifyEmailScreen />);
    expect(screen.getByText("Verify your email")).toBeOnTheScreen();
  });

  it("displays the user email", () => {
    render(<VerifyEmailScreen />);
    expect(screen.getByText("test@example.com")).toBeOnTheScreen();
  });

  it("renders verification button", () => {
    render(<VerifyEmailScreen />);
    expect(
      screen.getByText("I've verified my email"),
    ).toBeOnTheScreen();
  });

  it("renders resend button", () => {
    render(<VerifyEmailScreen />);
    expect(
      screen.getByText("Resend verification email"),
    ).toBeOnTheScreen();
  });

  it("renders sign out button", () => {
    render(<VerifyEmailScreen />);
    expect(screen.getByText("Sign out")).toBeOnTheScreen();
  });
});
