/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      animation: {
        blob: "blob 20s infinite",
        "fade-in": "fade-in 1s ease-in-out forwards",
        "fade-out": "fade-out 1.5s ease-in-out forwards",
        "sharpen-in": "sharpen-in 1.5s ease-in-out forwards",
        "sharpen-out": "sharpen-out 1.5s ease-in-out forwards",
        pulse: "pulse 2s infinite",
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
        "fade-in": {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
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
        "sharpen-out": {
          "0%": {
            filter: "blur(0px)",
          },
          "100%": {
            filter: "blur(8px)",
          },
        },
        pulse: {
          "0%": {
            transform: "scale(1)",
          },
          "50%": {
            transform: "scale(2)",
          },
          "100%": {
            transform: "scale(1)",
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
