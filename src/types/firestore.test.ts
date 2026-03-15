import {
  getDisplayAmountCents,
  roundToUnit,
  sumDisplayCents,
  computeTotalCents,
  computeEmergencyTarget,
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

describe("computeEmergencyTarget", () => {
  const expenses = [
    {
      amountCents: 80000,
      billingFrequency: "monthly" as const,
      priority: "essential" as const,
    },
    {
      amountCents: 3500,
      billingFrequency: "monthly" as const,
      priority: "reducible" as const,
    },
    {
      amountCents: 1299,
      billingFrequency: "monthly" as const,
      priority: "optional" as const,
    },
  ];

  it("defaults to essential and reducible", () => {
    const { monthlyEssentialCents } = computeEmergencyTarget(expenses, 6);
    // 80000 + 3500 = 83500 monthly → yearly 1002000 → monthly 83500 → roundToUnit = 83500
    expect(monthlyEssentialCents).toBe(83500);
  });

  it("includes only specified priorities", () => {
    const { monthlyEssentialCents } = computeEmergencyTarget(expenses, 6, [
      "essential",
      "reducible",
    ]);
    // 80000 + 3500 = 83500 monthly → yearly 1002000 → monthly 83500 → roundToUnit = 83500
    expect(monthlyEssentialCents).toBe(83500);
  });

  it("includes all priorities when all specified", () => {
    const { monthlyEssentialCents } = computeEmergencyTarget(expenses, 6, [
      "essential",
      "reducible",
      "optional",
    ]);
    // 80000 + 3500 + 1299 = 84799 → yearly 1017588 → /12 = 84799 → roundToUnit = 84800
    expect(monthlyEssentialCents).toBe(84800);
  });

  it("multiplies monthly cost by months for target", () => {
    const { targetCents } = computeEmergencyTarget(expenses, 6);
    // 83500 * 6 = 501000 → roundToUnit = 501000
    expect(targetCents).toBe(501000);
  });
});
