/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: {
          50: "#f9ecec",
          100: "#f2d6d6",
          200: "#e6b3b3",
          300: "#d98f8f",
          400: "#cc6b6b",
          500: "#b94646",
          600: "#a22f2f",
          700: "#8c1919",
          800: "#730909",
          900: "#590000",
        },
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          500: "#22c55e",
          600: "#16a34a",
          700: "#17af46",
          800: "#1ac14d",
          900: "#1cd254",
        },
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          500: "#f59e0b",
          600: "#d97706",
          700: "#d7ac00",
          800: "#ebbc00",
          900: "#ffcc00",
        },
        error: {
          50: "#fef2f2",
          100: "#fee2e2",
          500: "#ef4444",
          600: "#dc2626",
          700: "#e01111",
          800: "#ce1010",
          900: "#bb0e0e",
        },
        danger: {
          100: "#fee2e2",
          500: "#ef4444",
          600: "#dc2626",
          700: "#e01111",
          800: "#ce1010",
          900: "#bb0e0e",
        },
      },
    },
  },
  plugins: [],
};
