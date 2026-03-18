import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cinema: {
          black: '#0a0a0a',
          dark: '#111111',
          darker: '#0d0d0d',
          panel: '#1a1a1a',
          surface: '#222222',
          border: '#2a2a2a',
          muted: '#666666',
          text: '#e0e0e0',
          white: '#f5f5f5',
          accent: '#e85d04',
          'accent-hover': '#f48c06',
          gold: '#ffd60a',
          red: '#ef233c',
          green: '#06d6a0',
          blue: '#118ab2',
          purple: '#7b2cbf',
          cyan: '#00b4d8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'film-grain': 'filmGrain 0.5s steps(1) infinite',
        'reel-spin': 'reelSpin 2s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        filmGrain: {
          '0%, 100%': { opacity: '0.03' },
          '50%': { opacity: '0.06' },
        },
        reelSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(232, 93, 4, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(232, 93, 4, 0.6)' },
        },
      },
      backgroundImage: {
        'cinema-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
        'accent-gradient': 'linear-gradient(135deg, #e85d04 0%, #f48c06 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
