/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Update paths based on your project structure
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'), // Ensure DaisyUI is included
  ],
}
