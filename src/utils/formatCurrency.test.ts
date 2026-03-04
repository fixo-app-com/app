import { formatAmount } from "./formatCurrency";

describe("formatAmount", () => {
  it("formats cents with comma as decimal separator", () => {
    expect(formatAmount(1299, { symbol: "€" })).toBe("€12,99");
  });

  it("formats zero", () => {
    expect(formatAmount(0, { symbol: "€" })).toBe("€0,00");
  });

  it("formats large amounts with dot as thousand separator", () => {
    expect(formatAmount(1234567, { symbol: "€" })).toBe("€12.345,67");
  });

  it("formats negative amounts", () => {
    expect(formatAmount(-50000, { symbol: "€" })).toBe("-€500,00");
  });

  it("formats with hideDecimals", () => {
    expect(formatAmount(1234567, { symbol: "€", hideDecimals: true })).toBe(
      "€12.345",
    );
  });

  it("formats with suffixFormat", () => {
    expect(formatAmount(120000, { symbol: "€", suffixFormat: true })).toBe(
      "1.200 €",
    );
  });

  it("formats without symbol", () => {
    expect(formatAmount(1299)).toBe("12,99");
  });

  it("formats small amounts without thousand separator", () => {
    expect(formatAmount(999, { symbol: "€" })).toBe("€9,99");
  });
});
