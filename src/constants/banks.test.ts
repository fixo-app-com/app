import { getBankByKey, getCurrencySymbol } from "./banks";

describe("getBankByKey", () => {
  it("returns bank info for known key", () => {
    const bank = getBankByKey("revolut");
    expect(bank).toEqual({
      key: "revolut",
      name: "Revolut",
      color: "#0075EB",
      abbr: "R",
    });
  });

  it("returns undefined for unknown key", () => {
    expect(getBankByKey("nonexistent")).toBeUndefined();
  });
});

describe("getCurrencySymbol", () => {
  it("returns symbol for known currency code", () => {
    expect(getCurrencySymbol("EUR")).toBe("€");
    expect(getCurrencySymbol("USD")).toBe("$");
    expect(getCurrencySymbol("GBP")).toBe("£");
  });

  it("returns the code itself for unknown currency", () => {
    expect(getCurrencySymbol("XYZ")).toBe("XYZ");
  });
});
