import { getSortLabelKey } from "./sort";

describe("getSortLabelKey", () => {
  it("returns sort.newest for newest", () => {
    expect(getSortLabelKey("newest")).toBe("sort.newest");
  });

  it("returns sort.highest for price_desc", () => {
    expect(getSortLabelKey("price_desc")).toBe("sort.highest");
  });

  it("returns sort.lowest for price_asc", () => {
    expect(getSortLabelKey("price_asc")).toBe("sort.lowest");
  });

  it("falls back to sort.newest for unknown option", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(getSortLabelKey("unknown" as any)).toBe("sort.newest");
  });
});
