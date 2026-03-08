import { render, screen, fireEvent } from "@testing-library/react-native";
import SignUpScreen from "./SignUpScreen";

const mockNavigate = jest.fn();
const mockNavigation = { navigate: mockNavigate } as never;
const mockRoute = { params: undefined, key: "SignUp", name: "SignUp" } as never;

describe("SignUpScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the logo", () => {
    render(<SignUpScreen navigation={mockNavigation} route={mockRoute} />);
    expect(screen.getByTestId("logo")).toBeOnTheScreen();
  });

  it("renders email, password, and confirm password inputs", () => {
    render(<SignUpScreen navigation={mockNavigation} route={mockRoute} />);
    expect(screen.getByPlaceholderText("auth.email")).toBeOnTheScreen();
    expect(
      screen.getAllByPlaceholderText("auth.password").length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByPlaceholderText("auth.confirmPassword").length,
    ).toBeGreaterThan(0);
  });

  it("renders sign up button", () => {
    render(<SignUpScreen navigation={mockNavigation} route={mockRoute} />);
    expect(screen.getByText("auth.signUp")).toBeOnTheScreen();
  });

  it("renders social login buttons", () => {
    render(<SignUpScreen navigation={mockNavigation} route={mockRoute} />);
    expect(screen.getByText("auth.continueWithApple")).toBeOnTheScreen();
    expect(screen.getByText("auth.continueWithGoogle")).toBeOnTheScreen();
  });

  it("renders sign in link", () => {
    render(<SignUpScreen navigation={mockNavigation} route={mockRoute} />);
    expect(screen.getByText("auth.signIn")).toBeOnTheScreen();
  });

  it("navigates to SignIn screen", () => {
    render(<SignUpScreen navigation={mockNavigation} route={mockRoute} />);
    fireEvent.press(screen.getByText("auth.signIn"));
    expect(mockNavigate).toHaveBeenCalledWith("SignIn");
  });
});
