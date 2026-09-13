/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1D3043',
          dark: '#172A3C',
        },
        gold: {
          DEFAULT: '#A57A42',
          hover: '#8F6738',
        },
        'text-muted': '#74808C',
        'text-main': '#243445',
        border: '#DEDFE1',
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