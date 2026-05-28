/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        heading: ['"Josefin Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#760000',
          dark: '#5e0000',
          darker: '#480000',
          light: '#fdf4f4',
          muted: '#f9e6e6',
        },
        red: {
          50: '#fdf4f4',
          100: '#f9e6e6',
          200: '#efcccc',
          300: '#dfa8a8',
          400: '#c47070',
          500: '#a83838',
          600: '#760000',
          700: '#760000',
          800: '#5e0000',
          900: '#480000',
          950: '#2e0000',
        },
      },
    },
  },
  plugins: [],
}
