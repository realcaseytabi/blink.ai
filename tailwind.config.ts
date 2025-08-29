import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        'neon-pink': '#ff00ff',
        'neon-orange': '#ff7f11',
        'neon-blue': '#00eaff',
        'neon-yellow': '#ffe700'
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'var(--font-inter)', 'var(--font-montserrat)', 'sans-serif']
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(to bottom, #1a0033, #000000)'
      }
    }
  },
  plugins: [
    plugin(function ({ addUtilities, theme }) {
      const colors = theme('colors') as Record<string, string>;
      const newUtilities = Object.entries(colors)
        .filter(([key]) => key.startsWith('neon-'))
        .reduce((acc, [key, value]) => {
          acc[`.glow-${key}`] = {
            boxShadow: `0 0 10px ${value}, 0 0 20px ${value}`
          };
          return acc;
        }, {} as Record<string, any>);
      addUtilities(newUtilities);
    })
  ]
};

export default config;
