/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'qozon-gold': '#FBBF24',
        'qozon-amber': '#F59E0B',
        'qozon-orange': '#F97316',
        'qozon-dark': '#0a0a0a',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      },
      animation: {
        'fadeInUp': 'fadeInUp 0.6s ease-out',
        'shake': 'shake 0.5s ease-in-out',
        'slowZoom': 'slowZoom 20s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
}