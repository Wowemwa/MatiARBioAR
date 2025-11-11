/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#059669',
          blue: '#2563eb',
          purple: '#7e22ce'
        }
      },
      boxShadow: {
        'glow-green': '0 0 0 3px rgba(16,185,129,0.25)',
        'glow-blue': '0 0 0 3px rgba(37,99,235,0.25)'
      },
      transitionTimingFunction: {
        'bounce-soft': 'cubic-bezier(.34,1.56,.64,1)'
      },
      screens: {
        '3xl': '1920px',
        '4xl': '2560px',
      },
      maxWidth: {
        '8xl': '88rem', // 1408px for ultrawide
        '9xl': '96rem', // 1536px for very wide screens
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        }
      }
    }
  },
  plugins: [],
}
