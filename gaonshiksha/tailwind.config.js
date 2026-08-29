/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F2F3F2',
          100: '#E4E6E4',
          200: '#C8CCC8',
          700: '#1A1A9E',
          800: '#0A0A90',
          900: '#000083', // Midnight Dark Navy
          950: '#000083'
        },
        brand: {
          50: '#EBF1FF',
          100: '#D6E3FF',
          200: '#ADC7FF',
          400: '#4D7DFF',
          500: '#1A53F0',
          600: '#002EAF', // Royal Deep Electric Blue
          700: '#00248A',
          800: '#001A66',
          900: '#000083',
          950: '#000083'
        },
        yellow: {
          50: '#FFFDE5',
          100: '#FFF9B3',
          200: '#FFF580',
          300: '#FFEF4D',
          400: '#FFEB01', // Vibrant Electric Yellow
          500: '#FFEB01',
          600: '#E6D400',
          700: '#B3A500'
        },
        gold: {
          300: '#FFEF4D',
          400: '#FFEB01',
          500: '#FFEB01',
          600: '#E6D400'
        },
        canvas: {
          100: '#F2F3F2',
          500: '#F2F3F2'
        }
      },
      fontFamily: {
        sans: [
          'Noto Sans Devanagari',
          'Inter',
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
