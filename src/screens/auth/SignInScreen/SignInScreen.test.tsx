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

  it("renders the brand name", () => {
    render(<SignInScreen navigation={mockNavigation} route={mockRoute} />);
    expect(screen.getByText("FIXO")).toBeOnTheScreen();
  });

  it("renders email and password inputs", () => {
    render(<SignInScreen navigation={mockNavigation} route={mockRoute} />);
    expect(screen.getByPlaceholderText("Email")).toBeOnTheScreen();
    expect(screen.getByPlaceholderText("Password")).toBeOnTheScreen();
  });

  it("renders sign in button", () => {
    render(<SignInScreen navigation={mockNavigation} route={mockRoute} />);
    expect(screen.getByText("Sign In")).toBeOnTheScreen();
  });

  it("renders Google sign in button", () => {
    render(<SignInScreen navigation={mockNavigation} route={mockRoute} />);
    expect(screen.getByText("Sign in with Google")).toBeOnTheScreen();
  });

  it("renders forgot password link", () => {
    render(<SignInScreen navigation={mockNavigation} route={mockRoute} />);
    expect(screen.getByText("Forgot password?")).toBeOnTheScreen();
  });

  it("renders sign up link", () => {
    render(<SignInScreen navigation={mockNavigation} route={mockRoute} />);
    expect(screen.getByText("Sign Up")).toBeOnTheScreen();
  });

  it("navigates to ForgotPassword screen", () => {
    render(<SignInScreen navigation={mockNavigation} route={mockRoute} />);
    fireEvent.press(screen.getByText("Forgot password?"));
    expect(mockNavigate).toHaveBeenCalledWith("ForgotPassword");
  });

  it("navigates to SignUp screen", () => {
    render(<SignInScreen navigation={mockNavigation} route={mockRoute} />);
    fireEvent.press(screen.getByText("Sign Up"));
    expect(mockNavigate).toHaveBeenCalledWith("SignUp");
  });
});
