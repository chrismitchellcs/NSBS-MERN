/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3c5d4e",
          dark: "#2c4a3a",
          light: "#4d5e5f",
        },
      },
    },
  },
  plugins: [],
};
