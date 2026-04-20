/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Sahachari Design System */
        'kurobeni': '#281822',
        'blackberry': '#48192e',
        'copper': '#c59c79',
        'meadow': '#957083',
        'ivory': '#f5f0eb',
        'rose': '#c0506a',
        'teal': '#4a8a7f',
        /* Legacy colors for backward compatibility */
        'glass-deep': '#281822',
        'glass-surface': '#48192e',
        'accent-gold': '#c59c79',
        'accent-mauve': '#957083',
        'text-primary': '#f5f0eb',
        'text-secondary': '#f5f0eb',
        'text-tertiary': '#f5f0eb',
        'accent-rose': '#c0506a',
        'accent-teal': '#4a8a7f',
        /* Legacy colors for backward compatibility */
        'background': '#281822',
        'primary': '#c59c79',
        'secondary': '#957083',
        'accent': '#c0506a',
        'danger': '#c0506a',
        'warning': '#c59c79',
      },
      fontFamily: {
        'serif': ['"Cormorant Garamond"', 'serif'],
        'sans': ['"DM Sans"', 'sans-serif'],
        'mono': ['"DM Mono"', 'monospace'],
      },
      fontSize: {
        'h1': ['3.5rem', { fontWeight: '700', lineHeight: '1.1' }],
        'h2': ['2.5rem', { fontWeight: '600', lineHeight: '1.2' }],
        'h3': ['1.75rem', { fontWeight: '600', lineHeight: '1.3' }],
        'h4': ['1.5rem', { fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'label': ['0.625rem', { fontWeight: '600', textTransform: 'uppercase' }],
      },
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem',
      },
      borderRadius: {
        'sm': '12px',
        'md': '20px',
        'lg': '28px',
        'full': '50px',
      },
      boxShadow: {
        'glass': 'var(--shadow-md), var(--shadow-inset)',
        'glass-hover': 'var(--shadow-lg), var(--shadow-inset)',
        'glass-deep': '0 12px 48px rgba(40, 24, 34, 0.8), var(--shadow-inset)',
      },
      backdropBlur: {
        'glass': '20px',
        'glass-deep': '30px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '33%': { transform: 'translateY(-20px) translateX(10px)' },
          '66%': { transform: 'translateY(10px) translateX(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(197, 156, 121, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(197, 156, 121, 0.6)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 300ms ease-out forwards',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
