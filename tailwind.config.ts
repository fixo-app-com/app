import type { Config } from "tailwindcss";

export default {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
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
          100: "#f8fafc",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#030712",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
