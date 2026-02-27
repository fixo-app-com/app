import { render, screen } from "@testing-library/react-native";
import HomeScreen from "./HomeScreen";

describe("HomeScreen", () => {
  it("renders the brand name", () => {
    render(<HomeScreen />);
    expect(screen.getByText("FIXO")).toBeOnTheScreen();
  });
});
