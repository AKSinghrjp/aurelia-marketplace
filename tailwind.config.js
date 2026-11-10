/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#FDFBF7',
          100: '#FAF6EE',
          200: '#F4EFE2',
          300: '#E8DCBF',
          400: '#D5C39D',
          500: '#BAA175',
        },
        antique: {
          gold: '#C5A059',
          'gold-light': '#DFC286',
          'gold-dark': '#9A7730',
          bronze: '#7C4A27',
          amber: '#D97706',
          ruby: '#881337',
          emerald: '#064E3B',
          dark: '#111315',
          card: '#181B1F',
          border: '#2C323B',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
