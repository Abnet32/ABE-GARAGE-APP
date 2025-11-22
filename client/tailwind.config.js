/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-red": "#E61C23",
        "brand-blue": "#0B132B",
      },
      fontFamily: {
        sans: ["Outfit", "sans-serif"],
        amharic: ["Benaiah", "Noto Serif Ethiopic", "serif"],
      },
    },
  },
  plugins: [],
};
