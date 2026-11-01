/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#060913',
          900: '#0b1120',
          850: '#10192e',
          800: '#16223d',
          700: '#233256',
          600: '#334155',
        },
        brand: {
          purple: '#8b5cf6',
          indigo: '#6366f1',
          blue: '#3b82f6',
          cyan: '#06b6d4',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #3b82f6 100%)',
        'brand-gradient-hover': 'linear-gradient(135deg, #9333ea 0%, #4f46e5 50%, #2563eb 100%)',
      }
    },
  },
  plugins: [],
}
