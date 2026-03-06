import type { Config } from "tailwindcss";
import { colors } from "./src/constants/colors";

export default {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        fixo: colors.fixo,
        gray: colors.gray,
        positive: colors.positive,
        negative: colors.negative,
      },
    },
  },
  plugins: [],
} satisfies Config;
