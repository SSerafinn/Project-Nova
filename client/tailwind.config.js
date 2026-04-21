/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E9B949',
          dark: '#C99A32',
          light: '#FFF3CC',
        },
        secondary: {
          DEFAULT: '#7B6CF5',
          dark: '#5448D0',
          light: '#2D2560',
        },
        accent: {
          DEFAULT: '#E07B30',
          dark: '#B85F18',
          light: '#3A2010',
        },
        danger: {
          DEFAULT: '#FF4B4B',
          dark: '#EA2B2B',
          light: '#3D1010',
        },
        surface: '#131027',
        bg: '#0C0B1C',
        muted: '#7E7CA0',
        border: '#2E2A55',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        card: '0px 4px 0px #08070F',
        'card-primary': '0px 4px 0px #C99A32',
        'card-secondary': '0px 4px 0px #5448D0',
        'card-danger': '0px 4px 0px #EA2B2B',
        'glow-primary': '0 0 20px rgba(233,185,73,0.35)',
        'glow-secondary': '0 0 20px rgba(123,108,245,0.35)',
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
        novaPulse: {
          '0%, 100%': { boxShadow: '0 0 28px rgba(233,185,73,0.45), 0 0 60px rgba(233,185,73,0.12)' },
          '50%': { boxShadow: '0 0 42px rgba(233,185,73,0.70), 0 0 90px rgba(233,185,73,0.22)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.4s ease-out forwards',
        shake: 'shake 0.4s ease-in-out',
        bounceIn: 'bounceIn 0.5s ease-out forwards',
        pulse: 'pulse 1.5s ease-in-out infinite',
        novaPulse: 'novaPulse 2.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

