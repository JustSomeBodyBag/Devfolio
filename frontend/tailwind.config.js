/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // <- обязательно
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',   // странички и layout
    './src/components/**/*.{js,ts,jsx,tsx}', // если есть компоненты вне app
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}