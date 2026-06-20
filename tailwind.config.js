/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        slowZoom: 'slowZoom 20s ease-in-out infinite alternate',
      },
      keyframes: {
        slowZoom: {
          '0%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1.2)' },
        },
      },
    },
  },
  plugins: [],
};