import { render, screen } from "@testing-library/react-native";
import { DonutChart } from "./DonutChart";
import type { DonutSegment } from "./DonutChart";

jest.mock("../../../contexts/DataContext", () => ({
  useData: () => ({ currency: "EUR" }),
}));

const segments: DonutSegment[] = [
  { id: "cat1", name: "Subscriptions", icon: "\u{1F4FA}", totalCents: 5000 },
  { id: "cat2", name: "Food", icon: "\u{1F354}", totalCents: 3000 },
];

describe("DonutChart", () => {
  it("renders the card with testID", () => {
    render(
      <DonutChart segments={segments} totalCents={8000} allLabel="All" />,
    );
    expect(screen.getByTestId("donut-chart")).toBeOnTheScreen();
  });

  it("renders with a single segment", () => {
    render(
      <DonutChart
        segments={[segments[0]]}
        totalCents={5000}
        allLabel="All"
      />,
    );
    expect(screen.getByTestId("donut-chart")).toBeOnTheScreen();
  });
});
