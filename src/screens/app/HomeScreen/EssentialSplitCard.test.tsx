import { render, screen } from "@testing-library/react-native";
import { EssentialSplitCard } from "./EssentialSplitCard";
import { mockExpenses } from "../../../test/fixtures";

jest.mock("../../../contexts/DataContext", () => ({
  useData: () => ({ currency: "EUR" }),
}));

describe("EssentialSplitCard", () => {
  it("renders essential vs non-essential split", () => {
    render(<EssentialSplitCard expenses={mockExpenses} viewMode="monthly" />);
    expect(screen.getByTestId("essential-split")).toBeOnTheScreen();
    expect(screen.getByText("home.essential")).toBeOnTheScreen();
    expect(screen.getByText("home.nonEssential")).toBeOnTheScreen();
  });

  it("does not render when no expenses", () => {
    render(<EssentialSplitCard expenses={[]} viewMode="monthly" />);
    expect(screen.queryByTestId("essential-split")).toBeNull();
  });
});
