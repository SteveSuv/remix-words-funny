import { heroui } from "@heroui/react";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: { extend: { fontFamily: { Merriweather: "Merriweather" } } },
  darkMode: "class",
  plugins: [
    heroui({
      layout: {
        radius: {
          small: "0px",
          medium: "0px",
          large: "0px",
        },
      },
    }),
  ],
} satisfies Config;
