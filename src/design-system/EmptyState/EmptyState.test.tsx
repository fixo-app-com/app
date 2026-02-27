import { render, screen } from "@testing-library/react-native";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders message", () => {
    render(<EmptyState message="Nothing here yet." />);
    expect(screen.getByText("Nothing here yet.")).toBeOnTheScreen();
  });
});
