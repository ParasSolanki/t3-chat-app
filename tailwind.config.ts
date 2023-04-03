// eslint-disable-next-line @typescript-eslint/no-var-requires
import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)", ...fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("tailwindcss-animate")],
} satisfies Config;

export default config;
