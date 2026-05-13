import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        muted: "#4b5c79",
        line: "#d9e3f5",
        ocean: "#0078AE",
        cyanx: "#00B3F5",
        trust: "#14b87a",
        violetx: "#5c7cff"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(0, 120, 174, 0.12)",
        lift: "0 28px 74px rgba(0, 120, 174, 0.18)"
      },
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;

