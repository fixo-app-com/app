import { emojiToColor, darkenColor } from "./emojiColor";

describe("emojiToColor", () => {
  it("returns a hex color string", () => {
    const color = emojiToColor("🍔");
    expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it("returns the same color for the same emoji", () => {
    expect(emojiToColor("📺")).toBe(emojiToColor("📺"));
  });

  it("returns different colors for different emojis", () => {
    const a = emojiToColor("📺");
    const b = emojiToColor("🍔");
    expect(a).not.toBe(b);
  });
});

describe("darkenColor", () => {
  it("darkens a hex color by 30% by default", () => {
    const result = darkenColor("#FF0000");
    // R: 255 * 0.7 = 179 (0xb3), G: 0, B: 0
    expect(result).toBe("#b30000");
  });

  it("accepts a custom factor", () => {
    const result = darkenColor("#FFFFFF", 0.5);
    // 255 * 0.5 = 128 (0x80)
    expect(result).toBe("#808080");
  });

  it("returns black for factor 1", () => {
    expect(darkenColor("#ABCDEF", 1)).toBe("#000000");
  });
});
