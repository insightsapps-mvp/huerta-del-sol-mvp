/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        huerta: { 50: '#f1f8ef', 100: '#ddeed8', 200: '#bcdcb2', 300: '#8fc282', 400: '#62a455', 500: '#448838', 600: '#336c2a', 700: '#2a5524', 800: '#244520', 900: '#1d3a1b', 950: '#0d200c' },
        tierra: { 50: '#fbf6f1', 100: '#f5e9dc', 200: '#ead1b6', 300: '#ddb287', 400: '#cf8d57', 500: '#c47439', 600: '#b45f2e', 700: '#954a28', 800: '#793d27', 900: '#633423' },
        crema: '#fbf9f4',
      },
      boxShadow: { card: '0 1px 2px rgba(29,58,27,.06), 0 1px 1px rgba(29,58,27,.04)', pop: '0 18px 40px -16px rgba(29,58,27,.35)' },
    },
  },
  plugins: [],
};
