/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors";
delete colors["lightBlue"];
delete colors["warmGray"];
delete colors["trueGray"];
delete colors["coolGray"];
delete colors["blueGray"];
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // screens: {
    //   sm: "640px",
    //   // => @media (min-width: 640px) { ... }

    //   md: "768px",
    //   // => @media (min-width: 768px) { ... }

    //   lg: "990px",
    //   // => @media (min-width: 1024px) { ... }

    //   xl: "1280px",
    //   // => @media (min-width: 1280px) { ... }

    //   "2xl": "1536px",
    //   // => @media (min-width: 1536px) { ... }
    // },
    container: {
      padding: {
        DEFAULT: "0.5rem",
        "2xl": "1rem",
        "3xl": "3rem",
      },
    },
    fontFamily: {
      main: ["Open Sans", "sans-serif"],
      sans: [
        "ui-sans-serif",
        "system-ui",
        "system-ui",
        "-apple-system",
        "BlinkMacSystemFont",
      ],
      serif: [
        "ui-serif",
        "Georgia",
        "Cambria",
        "Times New Roman",
        "Times",
        "serif",
      ],
      mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas"],
    },

    extend: {
      backgroundImage: {
        "image-music": "url('/images/bgmusic.gif')",
      },
    },
    colors: {
      ...colors,
      transparent: "transparent",
      current: "currentColor",
      main: "#4EAC6D",
      "status-online": "#06d6a0",
      menu: "#2E2E2E",
    },
  },

  plugins: [],
};
