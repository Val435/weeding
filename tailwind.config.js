export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'], // para títulos
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'], // para texto
      },
    },
  },
  plugins: [],
}
