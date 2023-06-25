import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("daisyui"),
  ],
  daisyui: {
    themes: [
      "light",
      "cupcake",
      "pastel",
      "corporate",
      "lofi",
      "dracula",
      "autumn",
    ],
  },
} satisfies Config;
