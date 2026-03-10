import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-literata)", "Georgia", "serif"],
      },
      colors: {
        paper: "#f5f0e8",
        ink: "#1a1614",
        accent: "#c45c3e",
        muted: "#6b5b52",
      },
    },
  },
  plugins: [],
} satisfies Config;
