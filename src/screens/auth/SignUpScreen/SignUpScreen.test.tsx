import { render, screen, fireEvent } from "@testing-library/react-native";
import SignUpScreen from "./SignUpScreen";

const mockNavigate = jest.fn();
const mockNavigation = { navigate: mockNavigate } as never;
const mockRoute = { params: undefined, key: "SignUp", name: "SignUp" } as never;

describe("SignUpScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the brand name", () => {
    render(<SignUpScreen navigation={mockNavigation} route={mockRoute} />);
    expect(screen.getByText("FIXO")).toBeOnTheScreen();
  });

  it("renders email, password, and confirm password inputs", () => {
    render(<SignUpScreen navigation={mockNavigation} route={mockRoute} />);
    expect(screen.getByPlaceholderText("Email")).toBeOnTheScreen();
    expect(screen.getByPlaceholderText("Password")).toBeOnTheScreen();
    expect(
      screen.getByPlaceholderText("Confirm password"),
    ).toBeOnTheScreen();
  });

  it("renders sign up button", () => {
    render(<SignUpScreen navigation={mockNavigation} route={mockRoute} />);
    expect(screen.getByText("Sign Up")).toBeOnTheScreen();
  });

  it("renders sign in link", () => {
    render(<SignUpScreen navigation={mockNavigation} route={mockRoute} />);
    expect(screen.getByText("Sign In")).toBeOnTheScreen();
  });

  it("navigates to SignIn screen", () => {
    render(<SignUpScreen navigation={mockNavigation} route={mockRoute} />);
    fireEvent.press(screen.getByText("Sign In"));
    expect(mockNavigate).toHaveBeenCalledWith("SignIn");
  });
});
