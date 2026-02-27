/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#0A0A0A",
        card: "#171717",
        line: "#262626",
        accent: "#3B82F6",
        sale: "#F59E0B",
        muted: "#9CA3AF",
      },
      maxWidth: {
        "7.5xl": "1280px",
      },
      boxShadow: {
        panel: "0 10px 28px rgba(0, 0, 0, 0.35)",
        hover: "0 12px 34px rgba(0, 0, 0, 0.44)",
      },
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};

