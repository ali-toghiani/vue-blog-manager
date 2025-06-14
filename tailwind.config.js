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
          50: '#E0F7F7',
          100: '#99E3E3',
          200: '#E3F6E9',
          300: '#009595',
          500: '#007070',
          700: '#004A4A',
        },
        red: {
          50: '#FAE4E4',
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
          300: '#F0F0F0',
          500: '#E6E6E6',
          600: '#7F7F7F',
          700: '#616161',
        },
        white: '#FFFFFF',
        'golden-state': '#FFAB00'
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        7: '28px',
        8: '32px',
        9: '36px'
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '10px',
        xl: '12px'
      },
      fontSize: {
        base: '14px'
      }
    },
  },
  plugins: [],
};