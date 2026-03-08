import { render, screen } from "@testing-library/react-native";
import { FixedCostRatioCard } from "./FixedCostRatioCard";

describe("FixedCostRatioCard", () => {
  const baseProps = {
    totalCents: 100000,
    incomeDisplayCents: 250000,
  };

  it("renders nothing when income is zero", () => {
    const { toJSON } = render(
      <FixedCostRatioCard {...baseProps} incomeDisplayCents={0} />,
    );
    expect(toJSON()).toBeNull();
  });

  it("renders nothing when income is negative", () => {
    const { toJSON } = render(
      <FixedCostRatioCard {...baseProps} incomeDisplayCents={-100} />,
    );
    expect(toJSON()).toBeNull();
  });

  it("renders section header", () => {
    render(<FixedCostRatioCard {...baseProps} />);
    expect(screen.getByText("home.fixedCosts")).toBeOnTheScreen();
  });

  it("displays correct percentage", () => {
    render(<FixedCostRatioCard {...baseProps} />);
    expect(screen.getByText("40%")).toBeOnTheScreen();
  });

  it("displays 100% when costs equal income", () => {
    render(
      <FixedCostRatioCard totalCents={200000} incomeDisplayCents={200000} />,
    );
    expect(screen.getByText("100%")).toBeOnTheScreen();
  });

  it("displays percentage over 100 when costs exceed income", () => {
    render(
      <FixedCostRatioCard totalCents={300000} incomeDisplayCents={200000} />,
    );
    expect(screen.getByText("150%")).toBeOnTheScreen();
  });

  it("shows ofIncomeFixed and idealUnder labels", () => {
    render(<FixedCostRatioCard {...baseProps} />);
    expect(screen.getByText("home.ofIncomeFixed")).toBeOnTheScreen();
    expect(screen.getByText("home.idealUnder")).toBeOnTheScreen();
  });
});
