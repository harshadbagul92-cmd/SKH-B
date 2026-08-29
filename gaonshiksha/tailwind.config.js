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
          900: '#0F172A',
          950: '#0A192F', // Deep Navy Brand Base
          800: '#1E293B',
          700: '#334155'
        },
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // Royal Academic Blue
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#0A192F'
        },
        gold: {
          400: '#fde047',
          500: '#facc15', // Energetic Yellow
          600: '#eab308', // Warm Gold
          700: '#ca8a04'
        },
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e'
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
