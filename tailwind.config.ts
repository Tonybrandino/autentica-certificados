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
        line: "#dfead8",
        ocean: "#3f7f12",
        cyanx: "#7ed038",
        trust: "#5caf18",
        violetx: "#5c7cff"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(63, 127, 18, 0.14)",
        lift: "0 28px 74px rgba(63, 127, 18, 0.2)"
      },
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;

