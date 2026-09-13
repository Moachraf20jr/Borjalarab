/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#12230E',
          dark: '#0D1A0B',
        },
        gold: {
          DEFAULT: '#C76734',
          hover: '#A85728',
        },
        ink: '#12230E',
        terracotta: '#C76734',
        support: '#A9CCD8',
        cream: '#FAF8F5',
        stone: '#E4DED6',
        'text-muted': '#6A7862',
        'text-main': '#24301F',
        border: '#E4DED6',
      },
      fontFamily: {
        sans: ['Cairo', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
}