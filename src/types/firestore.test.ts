import {
  getDisplayAmountCents,
  roundToUnit,
  sumDisplayCents,
  computeTotalCents,
} from "./firestore";

describe("getDisplayAmountCents", () => {
  it("returns amountCents for monthly expense in monthly mode", () => {
    expect(
      getDisplayAmountCents(
        { amountCents: 1299, billingFrequency: "monthly" },
        "monthly",
      ),
    ).toBe(1299);
  });

  it("returns amountCents * 12 for monthly expense in yearly mode", () => {
    expect(
      getDisplayAmountCents(
        { amountCents: 1299, billingFrequency: "monthly" },
        "yearly",
      ),
    ).toBe(1299 * 12);
  });

  it("returns amountCents / 12 (rounded) for yearly expense in monthly mode", () => {
    expect(
      getDisplayAmountCents(
        { amountCents: 120000, billingFrequency: "yearly" },
        "monthly",
      ),
    ).toBe(10000);
  });

  it("returns amountCents for yearly expense in yearly mode", () => {
    expect(
      getDisplayAmountCents(
        { amountCents: 120000, billingFrequency: "yearly" },
        "yearly",
      ),
    ).toBe(120000);
  });

  it("rounds monthly equivalent for yearly expense that doesn't divide evenly", () => {
    // 10000 / 12 = 833.33... → rounds to 833
    expect(
      getDisplayAmountCents(
        { amountCents: 10000, billingFrequency: "yearly" },
        "monthly",
      ),
    ).toBe(833);
  });
});

describe("roundToUnit", () => {
  it("rounds up when remainder >= 30", () => {
    expect(roundToUnit(1230)).toBe(1300);
    expect(roundToUnit(1250)).toBe(1300);
    expect(roundToUnit(1299)).toBe(1300);
  });

  it("rounds down when remainder < 30", () => {
    expect(roundToUnit(1200)).toBe(1200);
    expect(roundToUnit(1215)).toBe(1200);
    expect(roundToUnit(1229)).toBe(1200);
  });

  it("handles zero", () => {
    expect(roundToUnit(0)).toBe(0);
  });

  it("handles negative values", () => {
    expect(roundToUnit(-1250)).toBe(-1300);
    expect(roundToUnit(-1215)).toBe(-1200);
  });

  it("handles exact unit amounts", () => {
    expect(roundToUnit(1000)).toBe(1000);
    expect(roundToUnit(500)).toBe(500);
  });
});

describe("sumDisplayCents", () => {
  const expenses = [
    { amountCents: 1299, billingFrequency: "monthly" as const },
    { amountCents: 120000, billingFrequency: "yearly" as const },
  ];

  it("sums display amounts in monthly mode", () => {
    // 1299 + round(120000/12) = 1299 + 10000 = 11299
    expect(sumDisplayCents(expenses, "monthly")).toBe(11299);
  });

  it("sums display amounts in yearly mode", () => {
    // 1299*12 + 120000 = 15588 + 120000 = 135588
    expect(sumDisplayCents(expenses, "yearly")).toBe(135588);
  });

  it("returns 0 for empty array", () => {
    expect(sumDisplayCents([], "monthly")).toBe(0);
  });
});

describe("computeTotalCents", () => {
  it("sums and rounds to nearest unit", () => {
    const expenses = [
      { amountCents: 1299, billingFrequency: "monthly" as const },
      { amountCents: 120000, billingFrequency: "yearly" as const },
    ];
    // sum monthly = 11299, roundToUnit(11299) → remainder 99 >= 30 → 11300
    expect(computeTotalCents(expenses, "monthly")).toBe(11300);
  });

  it("returns 0 for empty array", () => {
    expect(computeTotalCents([], "monthly")).toBe(0);
  });
});
