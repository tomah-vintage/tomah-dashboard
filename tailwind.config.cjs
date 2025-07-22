/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
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
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#FF6B35", // Orange/Coral
          "secondary": "#FFD700", // Yellow
          "accent": "#9C27B0", // Purple
          "neutral": "#2C2C2C", // Dark Charcoal
          "base-100": "#F8F9FA", // Light Gray
          "info": "#2196F3", // Info
          "success": "#4CAF50", // Success
          "warning": "#FF9800", // Warning
          "error": "#F44336", // Error
        },
      },
    ],
  },
};