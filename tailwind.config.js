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
          "light-green": "00FF88",
        },
        "signum-secondary": {
          DEFAULT: "#E8F3FF",
          light: "#EAF0F6",
          "midgnight-blue": "#021851",
        },
      },
    },
  },
  plugins: [],
};
