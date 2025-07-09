module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--custom-color)',
        'primary-dark': 'var(--custom-color-dark)',
      },
      ringColor: {
        DEFAULT: 'transparent', // чтобы кольца были прозрачными по умолчанию
      },
      ringWidth: {
        DEFAULT: '0px', // чтобы убрать толщину кольца
      },
    },
  },
  plugins: [],
};
