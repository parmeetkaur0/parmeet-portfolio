/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ---- Light theme (used across the whole site) ----
        paper: '#F7F6F2',
        paper2: '#FFFFFF',
        border: 'rgba(15,17,28,0.10)',
        surface: 'rgba(15,17,28,0.035)',
        ink: '#14151C',
        muted: '#5B5F70',
        accent: '#4F46E5',
        accent2: '#7C6FF0',
        warm: '#B4811F',

        // ---- Dark cinematic tokens, reserved for the hero + loader only ----
        'hero-bg': '#080A12',
        'hero-bg2': '#101522',
        'hero-border': 'rgba(255,255,255,0.10)',
        'hero-ink': '#F5F7FF',
        'hero-muted': '#A8B0C2',
        'hero-accent': '#7C83FF',
        'hero-accent2': '#B8A7FF',
        'hero-warm': '#E6C98A',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      transitionTimingFunction: {
        cinematic: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
