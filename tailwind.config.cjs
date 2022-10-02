/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      animation: {
        blob: "blob 20s infinite",
        "fade-out": "fade-out 1.5s ease-in-out forwards",
        "sharpen-in": "sharpen-in 1.5s ease-in-out forwards",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        "fade-out": {
          "0%": {
            opacity: 1,
          },
          "100%": {
            opacity: 0,
          },
        },
        "sharpen-in": {
          "0%": {
            filter: "blur(8px)",
          },
          "100%": {
            filter: "blur(0px)",
          },
        },
      },
      fontSize: {
        "4xl": "3rem",
      },
    },
  },
  plugins: [require("daisyui")],
};
