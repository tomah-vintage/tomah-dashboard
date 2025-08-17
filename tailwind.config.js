/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
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
        'primary': '#2563EB',
        'branding-red': '#DC2626',
        'sidebar-background': '#111827',
        'content-background': '#F3F4F6',
        'card-background': '#FFFFFF',
        'status-success': '#16A34A',
        'status-warning': '#FBBF24',
        'status-error': '#DC2626',
        'status-info': '#2563EB',
      },
      fontFamily: {
        sans: ['Roboto', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
      },
    },
  },
  plugins: [require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')()],
};