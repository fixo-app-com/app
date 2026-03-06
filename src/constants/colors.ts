/**
 * Single source of truth for the app's color palette.
 *
 * Used in two places:
 * 1. `tailwind.config.ts` — powers NativeWind className utilities
 * 2. Direct imports — for native props (ActivityIndicator, Switch, icons, etc.)
 */
export const colors = {
  fixo: {
    50: "#eef2ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1",
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
    950: "#1e1b4b",
  },
  gray: {
    100: "#f1f5f9",
    200: "#e5e7eb",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#030712",
  },
  positive: {
    400: "#4ade80",
  },
  negative: {
    400: "#f87171",
  },
  white: "#ffffff",
  red: {
    500: "#ef4444",
  },
};
