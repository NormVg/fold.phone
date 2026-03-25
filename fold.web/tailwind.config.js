/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/components/**/*.{js,vue,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/plugins/**/*.{js,ts}",
    "./app/app.vue",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          dark: '#0a0a0a',
        },
        brand: {
          cream: '#EDEADC',
          red: '#810100',
          'red-light': '#a50201',
          charcoal: '#1a1a1a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Newsreader', 'serif'], // or another serif/italic font like Playfair Display
      }
    },
  },
  plugins: [],
}
