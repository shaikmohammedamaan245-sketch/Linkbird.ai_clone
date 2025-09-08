import type { Config } from "tailwindcss"

export default {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#6B5CFF",
          50: "#F2F1FF",
          100: "#E6E4FF",
          200: "#C9C3FF",
          300: "#ABA2FF",
          400: "#8D82FF",
          500: "#6B5CFF",
          600: "#5649CC",
          700: "#403799",
          800: "#2B2466",
          900: "#161233"
        }
      }
    }
  },
  plugins: []
} satisfies Config
