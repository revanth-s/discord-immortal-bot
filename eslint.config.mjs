import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    ignores: [
      "**/dist/",
      "**/node_modules/",
      "**/*.min.js",
      "**/*.bundle.js",
      "**/coverage/",
      "**/jest.config.js",
      "**/prettier.config.js",
      "**/.DS_Store",
      "eslint.config.mjs"
    ]
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      // Disabling specific console logs as we are using pino logger
      'no-console': 'warn',
      // Allowing underscores for unused variables
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Use standard type safety rules
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  }
);
