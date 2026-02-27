import { render, screen } from "@testing-library/react-native";
import { CurrencyText } from "./CurrencyText";

describe("CurrencyText", () => {
  it("formats cents as euro amount", () => {
    render(<CurrencyText cents={1299} />);
    expect(screen.getByText("\u20AC12.99")).toBeOnTheScreen();
  });

  it("formats zero cents", () => {
    render(<CurrencyText cents={0} />);
    expect(screen.getByText("\u20AC0.00")).toBeOnTheScreen();
  });

  it("formats large amounts", () => {
    render(<CurrencyText cents={100050} />);
    expect(screen.getByText("\u20AC1000.50")).toBeOnTheScreen();
  });
});
