import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        tasklify: {
          "purple-dark": "#6C3C7C",
          purple: "#8B5A9F",
          "purple-mid": "#9B6FB0",
          "purple-light": "#B49BC8",
          pink: "#F499B6",
          "pink-card": "#FFB3CC",
          "pink-dark": "#E85D8A",
          "pink-bright": "#FF9DBB",
          salmon: "#FFB3CC",
          gold: "#EFCA5C",
          "gold-dark": "#E0B84D",
          green: "#7DD8A8",
          bg: "#9A6FB5",
          "bg-light": "#B695C9",
          surface: "#FFFFFF",
          text: "#2D1B3D",
          "text-light": "#FFFFFF",
          border: "#7C4E93",
          "border-dark": "#6A3D7F",
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
