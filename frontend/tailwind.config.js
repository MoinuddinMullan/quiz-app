/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "tertiary": "#00e2f0",
        "on-surface": "#dfe2f0",
        "surface-container-highest": "#31353f",
        "on-error": "#690005",
        "surface-tint": "#7bd0ff",
        "background": "#0f131d",
        "surface": "#0f131d",
        "surface-container-high": "#262a34",
        "surface-container-lowest": "#0a0e17",
        "on-surface-variant": "#bdc8d1",
        "on-primary": "#00354a",
        "inverse-on-surface": "#2c303b",
        "error": "#ffb4ab",
        "outline-variant": "#3e484f",
        "primary": "#8ed5ff",
        "surface-bright": "#353944",
        "tertiary-container": "#00c4d0",
        "secondary-container": "#3f465c",
        "primary-fixed": "#c4e7ff",
        "on-primary-container": "#004965",
        "error-container": "#93000a",
        "outline": "#87929a",
        "on-error-container": "#ffdad6",
        "surface-container-low": "#171c25",
        "secondary": "#bec6e0",
        "surface-container": "#1b2029",
        "tertiary-fixed": "#7df4ff",
        "on-secondary-container": "#adb4ce",
        "surface-variant": "#31353f",
        "on-background": "#dfe2f0",
        "primary-container": "#38bdf8",
        "surface-dim": "#0f131d"
      },
      borderRadius: {
        DEFAULT: "0.25rem", lg: "0.5rem",
        xl: "0.75rem", full: "9999px"
      },
      fontFamily: {
        sans: ["Geist", "Inter", "sans-serif"],
        display: ["Inter", "sans-serif"]
      }
    }
  },
  plugins: []
};
