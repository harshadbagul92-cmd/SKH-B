/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c', // Saffron
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        rural: {
          green: '#059669',
          greenDark: '#065f46',
          earth: '#78350f',
          cream: '#fffdf7',
          sun: '#d97706',
          soil: '#451a03'
        }
      },
      fontFamily: {
        sans: [
          'Noto Sans Devanagari',
          'Mangal',
          'Segoe UI',
          'Roboto',
          'system-ui',
          '-apple-system',
          'sans-serif'
        ]
      }
    },
  },
  plugins: [],
}
