/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
  extend: {
    colors: {
      sol: {
        background: "#FAF9F7", // warm neutral (main background)
        bubble: "#Ffffff",    // assistant bubble
        accent: "#C88A65",    // clay accent (user bubble + send btn)
        accentHover: "#B27655",
        text: "#185a5f",      // deep neutral gray-green text
        subtext: "#4f7f81ff",   // muted gray-green labels
      },
    },
  },
},
  plugins: []
};
