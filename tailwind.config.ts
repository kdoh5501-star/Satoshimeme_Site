import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
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
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
        'eb-garamond': ['var(--font-eb-garamond)'],
        'cinzel': ['var(--font-cinzel)'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        'slide-right-to-left': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        'sparkle-float': {
          '0%, 100%': {
            transform: 'translateY(0px) scale(1)',
            opacity: '1'
          },
          '50%': {
            transform: 'translateY(-10px) scale(1.2)',
            opacity: '0.7'
          }
        },
        'sparkle-fade': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' }
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        'float-medium': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' }
        },
        'twinkle': {
          '0%, 100%': { opacity: '0.2', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.5)' }
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' }
        },
        'wave-slow': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        'wave-slower': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        'pulse-backdrop': {
          '0%, 100%': { opacity: '0.05' },
          '50%': { opacity: '0.15' }
        },
        'shimmer-glow': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' }
        },
        'light-sweep': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(300%)' }
        },
        'light-sweep-reverse': {
          '0%': { transform: 'translateX(300%)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        'light-sweep-slow': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' }
        },
        'gentle-pulse': {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' }
        }
      },
      animation: {
        'slide-right-to-left': 'slide-right-to-left 30s linear infinite',
        'sparkle-float': 'sparkle-float 2s ease-in-out infinite',
        'sparkle-fade': 'sparkle-fade 2s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'float-medium': 'float-medium 4s ease-in-out infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'wave-slow': 'wave-slow 8s ease-in-out infinite',
        'wave-slower': 'wave-slower 12s ease-in-out infinite',
        'pulse-backdrop': 'pulse-backdrop 6s ease-in-out infinite',
        'shimmer-glow': 'shimmer-glow 3s ease-in-out infinite',
        'light-sweep': 'light-sweep 4s ease-in-out infinite',
        'light-sweep-reverse': 'light-sweep-reverse 5s ease-in-out infinite',
        'light-sweep-slow': 'light-sweep-slow 6s ease-in-out infinite',
        'gentle-pulse': 'gentle-pulse 4s ease-in-out infinite'
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
