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
      {
        rii: {
          primary: "#d62323",
          secondary: "#5ba1cf",
          accent: "#EB8258",
          neutral: "#212121",
          "base-100": "#FFFFFF",
          info: "#3abff8",
          success: "#36d399",
          warning: "#fbbd23",
          error: "#f87272",
        },
        "rii-dark": {
          primary: "#d62323",
          secondary: "#5ba1cf",
          accent: "#EB8258",
          neutral: "#212121",
          "base-100": "#222",
          info: "#3abff8",
          success: "#36d399",
          warning: "#fbbd23",
          error: "#f87272",
        },
        "al-faidah": {
          ...require("daisyui/src/theming/themes")["[data-theme=cupcake]"],
        },
        "al-faidah-dark": {
          ...require("daisyui/src/theming/themes")["[data-theme=cupcake]"],
          neutral: "#2a323c",
          "neutral-focus": "#242b33",
          "neutral-content": "#A6ADBB",
          "base-100": "#1d232a",
          "base-200": "#191e24",
          "base-300": "#15191e",
          "base-content": "#F2F2F2",
        },
      },
    ],
  },
} satisfies Config;
