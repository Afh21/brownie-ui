/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './stories/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/*/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brownie UI brand colors
        primary: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#a18072',
          600: '#8a6a5c',
          700: '#73564a',
          800: '#5c4238',
          900: '#452f28',
          950: '#2d1f1a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
