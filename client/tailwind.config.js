/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        obsidian: {
          50: '#f0f0f5',
          100: '#e0e0eb',
          200: '#c2c2d6',
          300: '#9393b8',
          400: '#6b6b9e',
          500: '#4e4e85',
          600: '#3c3c6b',
          700: '#2a2a52',
          800: '#1a1a38',
          900: '#0d0d1f',
          950: '#06060f',
        },
        aurora: {
          pink: '#ff6b9d',
          purple: '#c77dff',
          blue: '#4895ef',
          teal: '#4cc9f0',
          green: '#06d6a0',
        },
      },
      backgroundImage: {
        'aurora-gradient': 'linear-gradient(135deg, #ff6b9d20, #c77dff20, #4cc9f020)',
        'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'shimmer': 'shimmer 1.5s infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        'glow-pink': '0 0 20px rgba(255,107,157,0.3)',
        'glow-purple': '0 0 20px rgba(199,125,255,0.3)',
        'glow-teal': '0 0 20px rgba(76,201,240,0.3)',
        'card': '0 8px 32px rgba(0,0,0,0.4)',
        'card-hover': '0 16px 48px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
};
