// postcss.config.mjs
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // This is the updated way to include Tailwind
    'tailwindcss/nesting': {}, 
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;