import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                background: "hsl(var(--bg-primary))",
                foreground: "hsl(var(--text-primary))",
                card: "hsl(var(--bg-secondary))",
                secondary: {
                    DEFAULT: "hsl(var(--bg-secondary))",
                    foreground: "hsl(var(--text-primary))",
                },
                tertiary: "hsl(var(--bg-tertiary))",
                primary: {
                    DEFAULT: "hsl(var(--accent-primary))",
                    foreground: "#ffffff",
                },
                border: "hsl(var(--border-color))",
                input: "hsl(var(--border-color))",
                ring: "hsl(var(--accent-primary))",
            },
            borderRadius: {
                lg: "var(--radius-lg)",
                md: "var(--radius-md)",
                sm: "var(--radius-sm)",
                xl: "var(--radius-xl)",
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            animation: {
                'float': 'float 3s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                glow: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.5' },
                },
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
export default config;
