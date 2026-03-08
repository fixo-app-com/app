import { fireEvent, render, screen } from "@testing-library/react-native";
import { SocialLoginButtons } from "./SocialLoginButtons";

const defaultProps = {
  onApplePress: jest.fn(),
  onGooglePress: jest.fn(),
  loadingAction: null as "email" | "apple" | "google" | null,
  isLoading: false,
};

describe("SocialLoginButtons", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders both buttons with labels", () => {
    render(<SocialLoginButtons {...defaultProps} />);
    expect(screen.getByText("auth.continueWithApple")).toBeOnTheScreen();
    expect(screen.getByText("auth.continueWithGoogle")).toBeOnTheScreen();
  });

  it("renders the divider", () => {
    render(<SocialLoginButtons {...defaultProps} />);
    expect(screen.getByText("auth.or")).toBeOnTheScreen();
  });

  it("calls onApplePress when Apple button is pressed", () => {
    const onApplePress = jest.fn();
    render(
      <SocialLoginButtons {...defaultProps} onApplePress={onApplePress} />,
    );
    fireEvent.press(screen.getByText("auth.continueWithApple"));
    expect(onApplePress).toHaveBeenCalledTimes(1);
  });

  it("calls onGooglePress when Google button is pressed", () => {
    const onGooglePress = jest.fn();
    render(
      <SocialLoginButtons {...defaultProps} onGooglePress={onGooglePress} />,
    );
    fireEvent.press(screen.getByText("auth.continueWithGoogle"));
    expect(onGooglePress).toHaveBeenCalledTimes(1);
  });

  it("shows Apple loading indicator when loadingAction is apple", () => {
    render(
      <SocialLoginButtons
        {...defaultProps}
        loadingAction="apple"
        isLoading={true}
      />,
    );
    expect(screen.queryByText("auth.continueWithApple")).not.toBeOnTheScreen();
    expect(screen.getByText("auth.continueWithGoogle")).toBeOnTheScreen();
  });

  it("shows Google loading indicator when loadingAction is google", () => {
    render(
      <SocialLoginButtons
        {...defaultProps}
        loadingAction="google"
        isLoading={true}
      />,
    );
    expect(screen.getByText("auth.continueWithApple")).toBeOnTheScreen();
    expect(screen.queryByText("auth.continueWithGoogle")).not.toBeOnTheScreen();
  });
});
