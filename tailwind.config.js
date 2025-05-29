/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Override default sans font
        inter: ['Inter', 'sans-serif'], // Keep inter utility
      },
      colors: {
        green: {
          100: '#99E3E3',
          300: '#009595',
          500: '#007070',
          700: '#004A4A',
        },
        red: {
          100: '#EFA5A6',
          300: '#D61E20',
          500: '#AB181A',
          700: '#801213 ',
        },
        blue: {
          100: '#99D2F3',
          300: '#0172B4',
          500: '#015687',
          700: '#00395A',
        },
        gray: {
          100: '#F5F5F5',
          300: '#E0E0E0',
          500: '#9E9E9E',
          700: '#616161',
        },
      },
      borderRadius: {
        lg: '10px'
      }
    },
  },
  plugins: [],
};