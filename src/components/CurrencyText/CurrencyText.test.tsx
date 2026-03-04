import { render, screen } from "@testing-library/react-native";
import { CurrencyText } from "./CurrencyText";

describe("CurrencyText", () => {
  it("formats cents as euro amount with comma decimal", () => {
    render(<CurrencyText cents={1299} />);
    expect(screen.getByText("€12,99")).toBeOnTheScreen();
  });

  it("formats zero cents", () => {
    render(<CurrencyText cents={0} />);
    expect(screen.getByText("€0,00")).toBeOnTheScreen();
  });

  it("formats large amounts with dot thousand separator", () => {
    render(<CurrencyText cents={100050} />);
    expect(screen.getByText("€1.000,50")).toBeOnTheScreen();
  });
});
