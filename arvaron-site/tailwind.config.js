/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        arvaronGreen: '#00bf63',
        arvaronBlue: '#0a6cff',
      }
    },
  },
  plugins: [],
}
