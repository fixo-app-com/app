import { render, screen, fireEvent } from "@testing-library/react-native";
import ForgotPasswordScreen from "./ForgotPasswordScreen";

const mockNavigate = jest.fn();
const mockNavigation = { navigate: mockNavigate } as never;
const mockRoute = {
  params: undefined,
  key: "ForgotPassword",
  name: "ForgotPassword",
} as never;

describe("ForgotPasswordScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the logo", () => {
    render(
      <ForgotPasswordScreen navigation={mockNavigation} route={mockRoute} />,
    );
    expect(screen.getByTestId("logo")).toBeOnTheScreen();
  });

  it("renders email input", () => {
    render(
      <ForgotPasswordScreen navigation={mockNavigation} route={mockRoute} />,
    );
    expect(screen.getByPlaceholderText("auth.email")).toBeOnTheScreen();
  });

  it("renders reset password button", () => {
    render(
      <ForgotPasswordScreen navigation={mockNavigation} route={mockRoute} />,
    );
    expect(screen.getByText("auth.sendResetLink")).toBeOnTheScreen();
  });

  it("renders back to login link", () => {
    render(
      <ForgotPasswordScreen navigation={mockNavigation} route={mockRoute} />,
    );
    expect(screen.getByText("auth.backToLogin")).toBeOnTheScreen();
  });

  it("navigates back to SignIn screen", () => {
    render(
      <ForgotPasswordScreen navigation={mockNavigation} route={mockRoute} />,
    );
    fireEvent.press(screen.getByText("auth.backToLogin"));
    expect(mockNavigate).toHaveBeenCalledWith("SignIn");
  });
});
