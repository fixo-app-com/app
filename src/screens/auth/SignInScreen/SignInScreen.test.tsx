import { render, screen, fireEvent } from "@testing-library/react-native";
import SignInScreen from "./SignInScreen";

// Create mock navigation and route
const mockNavigate = jest.fn();
const mockNavigation = { navigate: mockNavigate } as never;
const mockRoute = { params: undefined, key: "SignIn", name: "SignIn" } as never;

describe("SignInScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the logo", () => {
    render(<SignInScreen navigation={mockNavigation} route={mockRoute} />);
    expect(screen.getByTestId("logo")).toBeOnTheScreen();
  });

  it("renders email and password inputs", () => {
    render(<SignInScreen navigation={mockNavigation} route={mockRoute} />);
    expect(screen.getByPlaceholderText("auth.email")).toBeOnTheScreen();
    expect(
      screen.getAllByPlaceholderText("auth.password").length,
    ).toBeGreaterThan(0);
  });

  it("renders sign in button", () => {
    render(<SignInScreen navigation={mockNavigation} route={mockRoute} />);
    expect(screen.getByText("auth.signIn")).toBeOnTheScreen();
  });

  it("renders social login buttons", () => {
    render(<SignInScreen navigation={mockNavigation} route={mockRoute} />);
    expect(screen.getByText("auth.continueWithApple")).toBeOnTheScreen();
    expect(screen.getByText("auth.continueWithGoogle")).toBeOnTheScreen();
  });

  it("renders forgot password link", () => {
    render(<SignInScreen navigation={mockNavigation} route={mockRoute} />);
    expect(screen.getByText("auth.forgotPassword")).toBeOnTheScreen();
  });

  it("renders sign up link", () => {
    render(<SignInScreen navigation={mockNavigation} route={mockRoute} />);
    expect(screen.getByText("auth.signUp")).toBeOnTheScreen();
  });

  it("navigates to ForgotPassword screen", () => {
    render(<SignInScreen navigation={mockNavigation} route={mockRoute} />);
    fireEvent.press(screen.getByText("auth.forgotPassword"));
    expect(mockNavigate).toHaveBeenCalledWith("ForgotPassword");
  });

  it("navigates to SignUp screen", () => {
    render(<SignInScreen navigation={mockNavigation} route={mockRoute} />);
    fireEvent.press(screen.getByText("auth.signUp"));
    expect(mockNavigate).toHaveBeenCalledWith("SignUp");
  });
});
