/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: {
          DEFAULT: 'hsl(214.3 31.8% 91.4%)',
          dark: 'hsl(217.2 32.6% 17.5%)'
        },
        input: {
          DEFAULT: 'hsl(214.3 31.8% 91.4%)',
          dark: 'hsl(217.2 32.6% 17.5%)'
        },
        ring: {
          DEFAULT: 'hsl(222.2 84% 4.9%)',
          dark: 'hsl(212.7 26.8% 83.9%)'
        },
        background: {
          DEFAULT: 'hsl(0 0% 100%)',
          dark: 'hsl(222.2 84% 4.9%)'
        },
        foreground: {
          DEFAULT: 'hsl(222.2 84% 4.9%)',
          dark: 'hsl(210 40% 98%)'
        },
        primary: {
          DEFAULT: 'hsl(222.2 47.4% 11.2%)',
          foreground: 'hsl(210 40% 98%)',
          dark: 'hsl(210 40% 98%)',
          'dark-foreground': 'hsl(222.2 84% 4.9%)'
        },
        secondary: {
          DEFAULT: 'hsl(210 40% 96%)',
          foreground: 'hsl(222.2 84% 4.9%)',
          dark: 'hsl(217.2 32.6% 17.5%)',
          'dark-foreground': 'hsl(210 40% 98%)'
        },
        muted: {
          DEFAULT: 'hsl(210 40% 96%)',
          foreground: 'hsl(215.4 16.3% 46.9%)',
          dark: 'hsl(217.2 32.6% 17.5%)',
          'dark-foreground': 'hsl(215 20.2% 65.1%)'
        },
        accent: {
          DEFAULT: 'hsl(210 40% 96%)',
          foreground: 'hsl(222.2 84% 4.9%)',
          dark: 'hsl(217.2 32.6% 17.5%)',
          'dark-foreground': 'hsl(210 40% 98%)'
        },
        card: {
          DEFAULT: 'hsl(0 0% 100%)',
          foreground: 'hsl(222.2 84% 4.9%)',
          dark: 'hsl(222.2 84% 4.9%)',
          'dark-foreground': 'hsl(210 40% 98%)'
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}