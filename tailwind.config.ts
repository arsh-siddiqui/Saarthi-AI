import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8FAFC",
        card: "#FFFFFF",
        primary: {
          DEFAULT: "#0D6EFD",
          dark: "#0a58ca",
          light: "#3d8bfd",
        },
        accent: {
          DEFAULT: "#10B981",
          dark: "#059669",
        },
        success: "#10B981",
        danger: "#EF4444",
        ink: "#111827",
        muted: "#6B7280",
        border: "#E5E7EB",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 10px rgba(17, 24, 39, 0.05)",
        card: "0 4px 20px rgba(17, 24, 39, 0.06)",
        elevated: "0 12px 32px rgba(17, 24, 39, 0.10)",
        glow: "0 8px 30px rgba(13, 110, 253, 0.20)",
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.75rem",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
      },
    },
  },
  plugins: [],
};
export default config;
