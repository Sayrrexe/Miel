import type {Config} from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
        'btn-primary': '#960047',  // цвет фона кнопки
        'btn-primary-hover': '#AB336C', // цвет фона кнопки при наведении
        'input-primary-hvr': '#F6F6F7', // цвет фона инпута
        'border-primary': '#CACBCD', // цвет бордера
        'l-gray': '#B9BABD', // цвет бордера (рамка авторизации)
        'menu-active': '#8BA7C2', // цвет активной ссылки бокового меню
        'selected-row': '#E6F9F9', // цвет фона выбранной строчки таблицы
        'menu-hvr': '#FF5E01', // цвет ссылки бокового меню при наведении
        'btn-sec-fg-hover': '#4f5052', // цвет текста (secondary/hover|press)
        'tertiary-text': '#798087', // цвет фона (tertiary)
        'error-text': '#C92C2C', // цвет текста (error)
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      fontFamily: {
        'geist': ['Geist', 'sans-serif'],
        'geist-mono': ['GeistMono', 'monospace'],
      },
      fontWeight: {
        'hairline': '100',
        'thin': '200',
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
      },
      fontStyle: {
        'normal': 'normal',
        'oblique': 'oblique',
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        'laptop': '1440px',
        '2xl': '1536px',
      },

    }
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
