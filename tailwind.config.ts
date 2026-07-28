import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#0a0e1a",
          900: "#0d1326",
          800: "#111827",
          700: "#1a2236",
          600: "#243049",
        },
        cyber: {
          400: "#4da6ff",
          500: "#2b8cff",
          600: "#1a6fd4",
          glow: "rgba(43, 140, 255, 0.15)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        hero: ["4rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        section: ["2.5rem", { lineHeight: "1.2", letterSpacing: "-0.015em", fontWeight: "700" }],
        sub: ["1.75rem", { lineHeight: "1.3", fontWeight: "600" }],
        card: ["1.375rem", { lineHeight: "1.35", fontWeight: "600" }],
        body: ["1.125rem", { lineHeight: "1.7", fontWeight: "400" }],
        label: ["1rem", { lineHeight: "1.5", fontWeight: "500" }],
        nav: ["1rem", { lineHeight: "1.4", fontWeight: "500" }],
        btn: ["1.0625rem", { lineHeight: "1.2", fontWeight: "600" }],
        stat: ["2.5rem", { lineHeight: "1.1", fontWeight: "700" }],
      },
      spacing: {
        section: "6rem",
      },
      maxWidth: {
        prose: "700px",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.3)",
        glow: "0 0 40px rgba(43, 140, 255, 0.12)",
        "glow-sm": "0 0 20px rgba(43, 140, 255, 0.08)",
      },
      animation: {
        "fade-in": "fadeIn 0.7s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "float-subtle": "floatSubtle 6s ease-in-out infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        floatSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
