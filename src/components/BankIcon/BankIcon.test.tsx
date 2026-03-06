import React from "react";
import { render, screen } from "@testing-library/react-native";
import { BankIcon } from "./BankIcon";

describe("BankIcon", () => {
  it("renders correct abbreviation for known bank key", () => {
    render(<BankIcon bankKey="revolut" />);
    expect(screen.getByText("R")).toBeTruthy();
  });

  it("renders ? for unknown bank key", () => {
    render(<BankIcon bankKey="nonexistent" />);
    expect(screen.getByText("?")).toBeTruthy();
  });

  it("uses gray fallback color for unknown bank", () => {
    const { toJSON } = render(<BankIcon bankKey="nonexistent" />);
    const tree = toJSON();
    // Root View should have gray background
    expect(tree).toBeTruthy();
    if (tree && !Array.isArray(tree)) {
      expect(tree.props.style.backgroundColor).toBe("#d1d5db");
    }
  });

  it("applies custom size prop", () => {
    const { toJSON } = render(<BankIcon bankKey="revolut" size={48} />);
    const tree = toJSON();
    if (tree && !Array.isArray(tree)) {
      expect(tree.props.style.width).toBe(48);
      expect(tree.props.style.height).toBe(48);
      expect(tree.props.style.borderRadius).toBe(24);
    }
  });
});
