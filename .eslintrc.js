module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
  ],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/',
    'build/',
    '.build-scripts/',
    'next-env.d.ts',
  ],
  rules: {
    // Add or override rules here
  },
  overrides: [
    {
      files: [
        'scripts/**',
        'scripts/**/*.ts',
        'scripts/**/*.tsx',
        'scripts/**/__tests__/**',
        'scripts/**/*.test.ts',
        'scripts/**/*.test.tsx',
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
  ],
};
