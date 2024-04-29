/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      keyframes: {
        'indeterminate': {
          from: {
            left: '-50%'
          },
          to: {
            left: '100%'
          }
        }
      },
      animation: {
        indeterminate: 'indeterminate 2s infinite linear'
      },
    },
  },
  plugins: [
    require('flowbite/plugin')({
      charts: true,
    }),
  ],
}

