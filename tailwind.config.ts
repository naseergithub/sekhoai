import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import rtl from "tailwindcss-rtl";
import plugin from "tailwindcss/plugin";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          dark: "#1D4ED8",
        },
        accent: {
          DEFAULT: "#7C3AED",
        },
        success: {
          DEFAULT: "#059669",
        },
        surface: "var(--color-surface)",
        card: "var(--color-card)",
        border: "var(--color-border)",
        "text-primary": "var(--color-text-primary)",
        "text-body": "var(--color-text-body)",
        "text-muted": "var(--color-text-muted)",
      },
      fontFamily: {
        urdu: ["var(--font-urdu)", "serif"],
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        display: ["3.5rem", { lineHeight: "1.2", fontWeight: "700" }],
        h1: ["2.5rem", { lineHeight: "1.3", fontWeight: "700" }],
        h2: ["2rem", { lineHeight: "1.4", fontWeight: "600" }],
        h3: ["1.5rem", { lineHeight: "1.5", fontWeight: "600" }],
        h4: ["1.25rem", { lineHeight: "1.5", fontWeight: "600" }],
        "body-lg": ["1.25rem", { lineHeight: "1.9" }],
        body: ["1.125rem", { lineHeight: "1.9" }],
        small: ["0.875rem", { lineHeight: "1.6" }],
        caption: ["0.75rem", { lineHeight: "1.5" }],
      },
      maxWidth: {
        container: "80rem",
      },
      borderRadius: {
        card: "1rem",
        button: "0.75rem",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "card-hover":
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease-out forwards",
        "fade-in": "fadeIn 0.3s ease-out forwards",
        "slide-in-right": "slideInRight 0.4s ease-out forwards",
        "pulse-soft": "pulseSoft 2s infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      backgroundImage: {
        "gradient-blue-violet": "var(--gradient-blue-violet)",
        "gradient-teal-blue": "var(--gradient-teal-blue)",
        "gradient-amber-orange": "var(--gradient-amber-orange)",
      },
    },
  },
  plugins: [
    typography,
    rtl,
    plugin(({ addBase, addComponents }) => {
      addBase({
        html: {
          direction: "rtl",
        },
      });
      addComponents({
        ".container-public": {
          maxWidth: "80rem",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          "@screen sm": {
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
          },
          "@screen lg": {
            paddingLeft: "2rem",
            paddingRight: "2rem",
          },
        },
        ".section-padding": {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          "@screen lg": {
            paddingTop: "6rem",
            paddingBottom: "6rem",
          },
        },
        ".text-urdu-body": {
          fontSize: "1.125rem",
          lineHeight: "1.9",
        },
      });
    }),
  ],
};

export default config;
