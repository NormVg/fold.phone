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
          light: '#EDEADC', // Main organic cream background
          dark: '#F4F2E8',  // Slightly darker cream for cards/sections
          charcoal: '#181717', // Main text color
        },
        brand: {
          cream: '#EDEADC',
          red: '#810100',
          'red-light': '#a50201',
          charcoal: '#181717',
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
