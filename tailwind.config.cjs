/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    require('path').join(require.resolve(
      '@skeletonlabs/skeleton'),
      '../**/*.{html,js,svelte,ts}'
    )
  ],
  theme: {
    extend: {
      colors: {
        'primary-orange': '#FF6B35',
        'dark-charcoal': '#2C2C2C',
        'light-gray': '#F8F9FA',
        'white': '#FFFFFF',
        'secondary-yellow': '#FFD700',
        'secondary-light-blue': '#E3F2FD',
        'secondary-purple': '#9C27B0',
        'secondary-green': '#4CAF50',
        'status-success': '#4CAF50',
        'status-warning': '#FF9800',
        'status-error': '#F44336',
        'status-info': '#2196F3',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
      },
    },
  },
  plugins: [require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')()],
};