import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "var(--color-bg-default)",
          base: "var(--color-bg-base)",
          card: "var(--color-bg-card)",
          muted: "var(--color-bg-muted)",
        },
        text: {
          DEFAULT: "var(--color-text-default)",
          base: "var(--color-text-base)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
        },
        accent: {
          green: "var(--color-accent-green)",
          yellow: "var(--color-accent-yellow)",
          blue: "var(--color-accent-blue)",
          red: "var(--color-accent-red)",
        },
        chart: {
          primary: "var(--color-chart-primary)",
          secondary: "var(--color-chart-secondary)",
          tertiary: "var(--color-chart-tertiary)",
        },
        border: {
          DEFAULT: "var(--color-border-default)",
          muted: "var(--color-border-muted)",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        card: "0px 8px 24px rgba(0, 0, 0, 0.12)",
        subtle: "0px 2px 8px rgba(0, 0, 0, 0.08)",
      },
    },
  },
} satisfies Config;
