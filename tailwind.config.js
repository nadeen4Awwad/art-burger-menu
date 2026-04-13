/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0F0F0F',
        card: '#1A1A1A',
        gold: '#D4AF37',
        'gold-dim': 'rgba(212,175,55,0.08)',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Cairo', 'Almarai', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
