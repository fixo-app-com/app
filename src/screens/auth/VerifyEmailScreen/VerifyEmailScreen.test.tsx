import { render, screen } from "@testing-library/react-native";
import VerifyEmailScreen from "./VerifyEmailScreen";
import { mockAuthContextDefaults } from "../../../test/mocks";

jest.mock("../../../contexts/AuthContext", () => ({
  useAuth: () => ({
    ...mockAuthContextDefaults,
    user: { email: "test@example.com", emailVerified: false },
  }),
}));

describe("VerifyEmailScreen", () => {
  it("renders the brand name", () => {
    render(<VerifyEmailScreen />);
    expect(screen.getByText("FIXO")).toBeOnTheScreen();
  });

  it("renders verify email heading", () => {
    render(<VerifyEmailScreen />);
    expect(screen.getByText("verify.title")).toBeOnTheScreen();
  });

  it("displays the verification message", () => {
    render(<VerifyEmailScreen />);
    expect(screen.getByText("verify.message")).toBeOnTheScreen();
  });

  it("renders verification button", () => {
    render(<VerifyEmailScreen />);
    expect(screen.getByText("verify.checkButton")).toBeOnTheScreen();
  });

  it("renders resend button", () => {
    render(<VerifyEmailScreen />);
    expect(screen.getByText("verify.resendButton")).toBeOnTheScreen();
  });

  it("renders sign out button", () => {
    render(<VerifyEmailScreen />);
    expect(screen.getByText("verify.signOut")).toBeOnTheScreen();
  });
});
