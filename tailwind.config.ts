// tailwind.config.ts
import type { Config } from "tailwindcss";
import tailwindTypography from '@tailwindcss/typography';

const config: Config = {
  // ✅ CRITICAL: This 'content' array must be correct.
  // It tells Tailwind to scan all .ts, .tsx, etc., files inside the 'src' folder.
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A4D68',   // Deep Blue
        secondary: '#088395', // Vibrant Teal
        accent: '#F5A623',    // Bright Orange
        lightGray: '#F4F7F6',
        darkText: '#333333',
        // Modern gradient colors
        'gradient-start': '#667eea',
        'gradient-end': '#764ba2',
        'accent-gradient-start': '#f093fb',
        'accent-gradient-end': '#f5576c',
        'success-gradient-start': '#4facfe',
        'success-gradient-end': '#00f2fe',
        'premium-gradient-start': '#a8edea',
        'premium-gradient-end': '#fed6e3',
        'neon': '#00ffff',
        'electric': '#ff00ff',
      },
      fontFamily: {
        // Fonts loaded via Google Fonts CDN with robust fallbacks
        heading: ['Montserrat', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        body: ['Lato', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'bounce-soft': 'bounce-soft 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'gradient-y': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center center'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '25%': {
            'background-size': '400% 400%',
            'background-position': 'right center'
          },
          '50%': {
            'background-size': '400% 400%',
            'background-position': 'center top'
          },
          '75%': {
            'background-size': '400% 400%',
            'background-position': 'center bottom'
          }
        },
        'pulse-glow': {
          '0%': { 'box-shadow': '0 0 20px rgba(59, 130, 246, 0.5)' },
          '100%': { 'box-shadow': '0 0 40px rgba(59, 130, 246, 0.8)' }
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
    },
  },
  plugins: [
    tailwindTypography,
  ],
};
export default config;