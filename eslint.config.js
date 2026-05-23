import eslintPluginTs from '@typescript-eslint/eslint-plugin';
import parserTs from '@typescript-eslint/parser';
import next from 'eslint-config-next';

export default [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      '.build-scripts/**',
      'next-env.d.ts',
    ],
    plugins: {
      '@typescript-eslint': eslintPluginTs,
    },
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      // Add or override rules here
    },
  },
  ...next,
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
];
