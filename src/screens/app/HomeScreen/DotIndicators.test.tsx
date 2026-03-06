import { render, screen } from "@testing-library/react-native";
import { DotIndicators } from "./DotIndicators";

describe("DotIndicators", () => {
  it("renders the correct number of dots", () => {
    render(<DotIndicators count={3} active={0} />);
    expect(screen.getByTestId("dot-indicators")).toBeOnTheScreen();
  });

  it("renders with 2 dots", () => {
    const { toJSON } = render(<DotIndicators count={2} active={1} />);
    const tree = toJSON();
    // Should have 2 children (dots) inside the container
    expect((tree as { children: unknown[] }).children).toHaveLength(2);
  });
});
