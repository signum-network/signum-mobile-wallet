/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        signum: {
          DEFAULT: "#0099ff",
          dark: "#0066ff",
        },
        "signum-secondary": {
          DEFAULT: "#E8F3FF",
          light: "#EAF0F6",
        },
        "light-green": { DEFAULT: "#00FF88" },
        "midgnight-blue": { DEFAULT: "#021851" },
        muted: {
          DEFAULT: "#F4F4F5",
          dark: "#27272A",
        },
        "muted-foreground": { DEFAULT: "#71717A", dark: "#A1A1AA" },
        "card-border": {
          DEFAULT: "#E4E4E7",
          dark: "#27272A",
        },
      },
    },
  },
  plugins: [],
};
