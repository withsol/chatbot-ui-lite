/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
  extend: {
    colors: {
      sol: {
        background: "#FAF9F7", // warm neutral (main background)
        bubble: "#F0EEEB",    // assistant bubble
        accent: "#C88A65",    // clay accent (user bubble + send btn)
        accentHover: "#B27655",
        text: "#2D2D2D",      // deep neutral text
        subtext: "#6B6B6B",   // muted gray labels
      },
    },
  },
},
  plugins: []
};
