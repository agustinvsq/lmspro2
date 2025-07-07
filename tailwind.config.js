module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'rgba(255,255,255,0.8)',
        matteBlack: '#111111',
      },
      backdropOpacity: {
        10: '0.1',
      },
    },
  },
  plugins: [],
};
