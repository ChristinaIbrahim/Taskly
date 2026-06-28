/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#003D9B",
        "primary-container": "#0052CC",
        "surface-highest": "#D7E2FF",
        "surface-low": "#F1F3FF",
        background: "#F9F9FF",
        
        "neutral-dark": "#041B3C",
        "neutral-gray": "#4F5F7B",
        "neutral-light": "#C3C6D6",
        
        success: "#62F5B6",
        error: "#B81D18",
        warning: "#FFB800",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}