/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D4A017',
          dark: '#B08010',
          light: '#FEF9E7',
        },
        secondary: {
          DEFAULT: '#78716C',
          dark: '#57534E',
          light: '#F5F0E8',
        },
        accent: {
          DEFAULT: '#C86A14',
          dark: '#A85510',
          light: '#FDECD0',
        },
        danger: {
          DEFAULT: '#FF4B4B',
          dark: '#EA2B2B',
          light: '#FFDDDD',
        },
        surface: '#FFFFFF',
        bg: '#FFFBF0',
        muted: '#A09060',
        border: '#E8DDB0',
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        body: ['Nunito Sans', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        card: '0px 4px 0px #C8B870',
        'card-primary': '0px 4px 0px #B08010',
        'card-secondary': '0px 4px 0px #57534E',
        'card-danger': '0px 4px 0px #EA2B2B',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-8px)' },
          '40%': { transform: 'translateX(8px)' },
          '60%': { transform: 'translateX(-6px)' },
          '80%': { transform: 'translateX(6px)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.4s ease-out forwards',
        shake: 'shake 0.4s ease-in-out',
        bounceIn: 'bounceIn 0.5s ease-out forwards',
        pulse: 'pulse 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
