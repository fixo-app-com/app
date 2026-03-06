import { fireEvent, render, screen } from "@testing-library/react-native";
import { FooterLink } from "./FooterLink";

describe("FooterLink", () => {
  it("renders message and link text", () => {
    render(
      <FooterLink
        message="Don't have an account? "
        linkText="Sign Up"
        onPress={jest.fn()}
      />,
    );
    expect(screen.getByText("Don't have an account? ")).toBeOnTheScreen();
    expect(screen.getByText("Sign Up")).toBeOnTheScreen();
  });

  it("calls onPress when link is pressed", () => {
    const onPress = jest.fn();
    render(
      <FooterLink
        message="Already have an account? "
        linkText="Sign In"
        onPress={onPress}
      />,
    );
    fireEvent.press(screen.getByText("Sign In"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("does not call onPress when disabled", () => {
    const onPress = jest.fn();
    render(
      <FooterLink
        message="Already have an account? "
        linkText="Sign In"
        onPress={onPress}
        disabled
      />,
    );
    fireEvent.press(screen.getByText("Sign In"));
    expect(onPress).not.toHaveBeenCalled();
  });
});
