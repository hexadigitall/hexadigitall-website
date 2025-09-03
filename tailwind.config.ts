// tailwind.config.ts
import type { Config } from "tailwindcss";

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
      },
      fontFamily: {
        // ✅ Ensure these match the variables in layout.tsx
        heading: ['var(--font-montserrat)', 'sans-serif'],
        body: ['var(--font-lato)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;