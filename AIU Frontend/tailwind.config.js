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
        obsidian: {
          base: 'var(--color-bg-base)',
          secondary: 'var(--color-bg-secondary)',
          surface: 'var(--color-surface)',
          elevated: 'var(--color-elevated)',
          border: 'var(--color-border)',
          borderHover: 'var(--color-border-hover)',
        },
        cyan: {
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)',
          glow: 'var(--glow-primary)',
        },
        indigo: {
          DEFAULT: 'var(--color-secondary)',
          glow: 'var(--glow-secondary)',
        },
        violet: {
          DEFAULT: 'var(--color-tertiary)',
        },
        emerald: {
          DEFAULT: 'var(--color-success)',
          glow: 'rgba(16, 185, 129, 0.15)',
        },
        amber: {
          DEFAULT: 'var(--color-warning)',
        },
        rose: {
          DEFAULT: 'var(--color-danger)',
        },
        typo: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
          veryMuted: 'var(--color-text-very-muted)',
        }
      },
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['var(--font-heading)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow-cyan': '0 0 25px -5px var(--glow-primary)',
        'glow-indigo': '0 0 25px -5px var(--glow-secondary)',
        'glow-emerald': '0 0 20px -4px rgba(16, 185, 129, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shine': 'shine 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shine: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        }
      }
    },
  },
  plugins: [],
}
