/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#F2F2F2",
        darkBackground: "#223D4D",
        card: "#FFFFFF",
        darkCard: "#1A303D",
        primary: "#FD802E",
        darkPrimary: "#FD802E",
        primaryLight: "#FFE0B2",
        darkPrimaryLight: "#332100",
        text: "#223D4D",
        darkText: "#FFFFFF",
        textLight: "#64748B",
        darkTextLight: "#94A3B8",
      }
    },
    darkMode: "class",
  },
  plugins: [],
}