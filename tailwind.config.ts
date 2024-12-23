import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

export default {
  content: [
    "./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: { extend: { fontFamily: { Merriweather: "Merriweather" } } },
  darkMode: "class",
  plugins: [
    nextui({
      layout: {
        radius: {
          small: "0px",
          medium: "0px",
          large: "0px",
        },
      },
      themes: {
        light: {},
        dark: {},
      },
    }),
  ],
} satisfies Config;
