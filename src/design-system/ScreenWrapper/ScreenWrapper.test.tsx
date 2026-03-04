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

  it("renders header prop content", () => {
    render(
      <ScreenWrapper header={<Text>Header Title</Text>}>
        <Text>Body</Text>
      </ScreenWrapper>,
    );
    expect(screen.getByText("Header Title")).toBeOnTheScreen();
    expect(screen.getByText("Body")).toBeOnTheScreen();
  });
});
