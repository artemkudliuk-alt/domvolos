import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        mist: "#f4f7fb",
        line: "#d7dee8",
        accent: "#111827",
        accentSoft: "#eef2f7"
      },
      boxShadow: {
        card: "0 18px 48px rgba(17, 24, 39, 0.12)"
      },
      backgroundImage: {
        "widget-glow":
          "radial-gradient(circle at top left, rgba(255,255,255,0.9), rgba(255,255,255,0.55) 35%, rgba(244,247,251,0.92) 100%)"
      }
    }
  },
  plugins: []
};

export default config;
