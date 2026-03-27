/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#F9FAFB", 
        darkBackground: "#121212",
        card: "#FFFFFF", 
        darkCard:"#1E1E1E",
        primary: "#FF8A00", 
        darkPrimary: "#FF9800",
        primaryLight: "#FFE0B2", 
        darkPrimaryLight: "#332100",
        text: "#1F2937", 
        darkText: "#F9FAFB",
        textLight: "#6B7280",
        darkTextLight: "#9CA3AF",
      }
    },
    darkMode: "class",
  },
  plugins: [],
}