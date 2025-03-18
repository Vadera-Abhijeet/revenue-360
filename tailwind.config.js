/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/lib/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "false",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f2f2ff",
          100: "#e0dfff",
          200: "#c2c0ff",
          300: "#a4a1ff",
          400: "#8682ff",
          500: "#6C63FF", // Primary color
          600: "#5f56e6",
          700: "#4e47c2",
          800: "#3e389e",
          900: "#2e2a7a",
          950: "#1f1c5a", // Darkest shade
        },
        secondary: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0d0d0d", // Darkest gray shade
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("flowbite/plugin"), require("flowbite/plugin")],
};
