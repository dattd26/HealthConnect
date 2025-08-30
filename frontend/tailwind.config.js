/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}', // Điều chỉnh đường dẫn theo dự án của bạn
  ],
  theme: {
    extend: {
      colors: {
        'primary-600': 'var(--primary-600)',
        'secondary-600': 'var(--secondary-600)',
      }
    },
  },
  plugins: [],
};