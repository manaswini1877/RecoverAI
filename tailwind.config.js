/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#07111F',
        surface: '#0D1B2A',
        'surface-elevated': '#12243A',
        'surface-highlight': '#1A304D',
        border: '#20344B',
        'border-light': '#2D4866',
        primary: {
          DEFAULT: '#8B5CF6',
          bright: '#A78BFA',
          light: '#C4B5FD',
          dark: '#6D28D9',
          glow: 'rgba(139, 92, 246, 0.25)',
        },
        mint: {
          DEFAULT: '#35D0A0',
          dark: '#059669',
          light: '#6EE7B7',
          glow: 'rgba(53, 208, 160, 0.2)',
        },
        amber: {
          DEFAULT: '#F5B84B',
          dark: '#D97706',
          light: '#FDE68A',
          glow: 'rgba(245, 184, 75, 0.2)',
        },
        coral: {
          DEFAULT: '#F16B6B',
          dark: '#DC2626',
          light: '#FCA5A5',
          glow: 'rgba(241, 107, 107, 0.2)',
        },
        main: '#F4F7FB',
        muted: '#91A4B8',
        subtle: '#5A7188',
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'Geist Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 2px 6px -1px rgba(0, 0, 0, 0.4)',
        'glow-violet': '0 0 25px -3px rgba(139, 92, 246, 0.35)',
        'glow-mint': '0 0 25px -3px rgba(53, 208, 160, 0.35)',
        'glow-coral': '0 0 25px -3px rgba(241, 107, 107, 0.35)',
      },
      keyframes: {
        pulseSlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(0.98)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' }
        }
      },
      animation: {
        'pulse-slow': 'pulseSlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
