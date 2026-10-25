import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFF9F2", // 60% main bg
        primary: {
          DEFAULT: "#800020", // 30% sidebar, header, & footer
          hover: "#66001A",
        },
        accent: {
          DEFAULT: "#D45060", // 10% highlight, button, & link
          hover: "#C03D4F",
        },
        textSecondary: "#6B7280", // text
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;