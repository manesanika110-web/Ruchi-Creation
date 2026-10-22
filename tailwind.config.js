/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mocha-cream': '#F5EEDC',
        'sand-bg': '#F5EEDC',
        'card-bg': '#FAF5EB',
        'deep-burgundy': '#632736',
        'burgundy-dark': '#4D1B28',
        'burgundy-btn': '#632736',
        'border-soft': '#E5DAC8',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        script: ['"Alex Brush"', 'cursive', 'Georgia', 'serif'],
        handwriting: ['"Caveat"', '"Dancing Script"', 'cursive'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
