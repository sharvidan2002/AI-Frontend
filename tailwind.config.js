/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pearl': '#F8F6F0',
        'pure-black': '#000000',
        'soft-black': '#1a1a1a',
        'gray-light': '#f5f5f5',
        'gray-medium': '#666666'
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}