import { render, screen } from "@testing-library/react-native";
import { EntityDetailScreen } from "./EntityDetailScreen";
import type { useSortSheet } from "../../../hooks/useSortSheet";

const mockSort: ReturnType<typeof useSortSheet> = {
  isOpen: false,
  open: jest.fn(),
  close: jest.fn(),
  selected: "newest",
  select: jest.fn(),
  triggerLabel: "Newest",
  title: "Sort by",
  options: [
    { value: "newest", label: "Newest" },
    { value: "price_desc", label: "Highest" },
  ],
};

describe("EntityDetailScreen", () => {
  const baseProps = {
    title: "Test Entity",
    onBack: jest.fn(),
    onEdit: jest.fn(),
    summaryPrefix: "Monthly total:",
    totalCents: 50000,
    sort: mockSort,
    expenses: [],
    loading: false,
    emptyMessage: "No expenses",
    getSubtitle: () => "Subtitle",
    onExpensePress: jest.fn(),
    onExpenseDelete: jest.fn(() => Promise.resolve()),
  };

  it("renders title", () => {
    render(<EntityDetailScreen {...baseProps} />);
    expect(screen.getByText("Test Entity")).toBeOnTheScreen();
  });

  it("renders summary prefix", () => {
    render(<EntityDetailScreen {...baseProps} />);
    expect(screen.getByText(/Monthly total:/)).toBeOnTheScreen();
  });

  it("renders empty message when no expenses", () => {
    render(<EntityDetailScreen {...baseProps} />);
    expect(screen.getByText("No expenses")).toBeOnTheScreen();
  });

  it("renders add button when onAdd provided", () => {
    render(<EntityDetailScreen {...baseProps} onAdd={jest.fn()} />);
    expect(screen.getByLabelText("Add")).toBeOnTheScreen();
  });

  it("does not render add button when onAdd not provided", () => {
    render(<EntityDetailScreen {...baseProps} />);
    expect(screen.queryByLabelText("Add")).toBeNull();
  });
});
