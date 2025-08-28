/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
  extend: {
    colors: {
      sol: {
        background: "#fffaffff", // warm neutral (main background)
        bubble: "#fffaffff",    // assistant bubble
        accent: "#eadaf0ff",    // lavender accent (user bubble + send btn)
        accentHover: "#bb9368ff",
        text: "#4c5d5fff",      // deep neutral gray-green text
        subtext: "#728c8fff",   // muted gray-green labels
      },
    },
  },
},
  plugins: []
};


