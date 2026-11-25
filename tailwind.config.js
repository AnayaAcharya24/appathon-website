/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--midnight)',
        foreground: 'var(--text-primary)',
        muted: { DEFAULT: 'var(--surface-raised)', foreground: 'var(--text-muted)' },
        primary: { DEFAULT: 'var(--brand-primary)', foreground: 'var(--text-primary)' },
        secondary: { DEFAULT: 'var(--surface-raised)', foreground: 'var(--text-primary)' },
        accent: { DEFAULT: 'var(--brand-violet)', foreground: 'var(--text-primary)' },
        border: 'var(--surface-border)',
        input: 'var(--input-border)',
        brand: {
          DEFAULT: 'rgb(var(--brand-rgb) / <alpha-value>)',
          bright: 'rgb(var(--brand-violet-rgb) / <alpha-value>)',
          deep: 'var(--brand-deep)',
          soft: 'var(--brand-soft)',
        },
        midnight: {
          DEFAULT: 'rgb(var(--midnight-rgb) / <alpha-value>)',
          deep: 'var(--midnight-deep)',
          card: 'var(--surface-card)',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: { lg: '0.75rem', xl: '1rem' },
    },
  },
  plugins: [],
}
