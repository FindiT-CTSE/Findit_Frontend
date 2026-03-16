/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#effaf6',
          100: '#d7f2e7',
          200: '#b2e5d1',
          300: '#80d1b3',
          400: '#47b58f',
          500: '#229b75',
          600: '#157d5f',
          700: '#12644d',
          800: '#114f3d',
          900: '#0f4133',
        },
        ink: '#102132',
        sand: '#f7f5ef',
        coral: '#ff7a59',
      },
      boxShadow: {
        soft: '0 18px 45px rgba(16, 33, 50, 0.08)',
        card: '0 12px 30px rgba(16, 33, 50, 0.08)',
      },
      backgroundImage: {
        'hero-grid':
          'linear-gradient(rgba(16,33,50,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16,33,50,0.05) 1px, transparent 1px)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
