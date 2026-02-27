import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { ScreenWrapper } from "./ScreenWrapper";

describe("ScreenWrapper", () => {
  it("renders children in view mode", () => {
    render(
      <ScreenWrapper>
        <Text>Content</Text>
      </ScreenWrapper>,
    );
    expect(screen.getByText("Content")).toBeOnTheScreen();
  });

  it("renders children in scroll mode", () => {
    render(
      <ScreenWrapper scroll>
        <Text>Scrollable</Text>
      </ScreenWrapper>,
    );
    expect(screen.getByText("Scrollable")).toBeOnTheScreen();
  });
});
