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
      },
    ],
  },
} satisfies Config;
