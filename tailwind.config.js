/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['"Bricolage Grotesque"', 'sans-serif'],
    },
    extend: {
      fontFamily: {
        'bricolage': ['"Bricolage Grotesque"', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        success: 'var(--success-color)',
        danger: 'var(--danger-color)',
        warning: 'var(--warning-color)',
        info: 'var(--info-color)',
      },
    },
  },
  plugins: [],
} 