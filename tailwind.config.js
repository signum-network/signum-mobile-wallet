/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./app/**/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/**/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        signum: {
          DEFAULT: "#0066ff",
          dark: "#0099ff",
        },
        "signum-secondary": {
          DEFAULT: "#E8F3FF",
          light: "#EAF0F6",
        },
        green: { DEFAULT: "#16A34A", dark: "#22C55E" },
        red: { DEFAULT: "#DC2626", dark: "#EF4444" },
        "midgnight-blue": { DEFAULT: "#021851" },
        muted: {
          DEFAULT: "#F4F4F5",
          dark: "#27272A",
        },
        "muted-foreground": { DEFAULT: "#71717A", dark: "#A1A1AA" },
        "card-foreground": {
          DEFAULT: "#FFFFFF",
          dark: "#1c1c1e",
        },
        "card-border": {
          DEFAULT: "#E4E4E7",
          dark: "#27272A",
        },
      },
    },
  },
  plugins: [],
};
