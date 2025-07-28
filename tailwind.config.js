/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'lato': ['Lato', 'sans-serif'],
        'league-spartan': ['League Spartan', 'sans-serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      colors: {
        'crackterview-black': '#101010',
        'crackterview-muted': '#D9D9D9',
        'crackterview-blue': '#0C2A92',
        'crackterview-light-blue': '#0F3DDE',
        'crackterview-gray': '#5A5A5D',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'logo-scroll': 'scroll 20s linear infinite',
      },
    },
  },
  plugins: [],
}
