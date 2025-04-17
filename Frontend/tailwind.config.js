/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: '#6366f1',
          secondary: '#f472b6',
          background: '#f3f4f6'
        },
        boxShadow: {
          'neumorphism': '20px 20px 60px #d1d1d1, -20px -20px 60px #ffffff'
        }
      },
    },
    plugins: [],
  }