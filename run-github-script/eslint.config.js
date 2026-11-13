/**
 * ESLint Flat Config for the project
 *
 * @see https://eslint.org/docs/latest/use/configure/configuration-files
 * @see https://typescript-eslint.io/
 */

import js from '@eslint/js'
import prettier from 'eslint-plugin-prettier'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'

export default [
  // 1. Global Ignores
  {
    // '**/.rollup.cache/**',
    ignores: ['node_modules/**', 'docs/**'],
  },

  // 2. Base Presets (Native Flat Config definitions)
  js.configs.recommended,
  eslintPluginPrettierRecommended,

  // 3. Environment, Parser, and Rules Overrides
  {
    plugins: {
      prettier,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      // Structural Overrides
      camelcase: 'off',
      'eslint-comments/no-use': 'off',
      'eslint-comments/no-unused-disable': 'off',
      'i18n-text/no-en': 'off',
      'import/no-namespace': 'off',
      'no-console': 'off',

      // 'no-shadow': 'off',
      'no-unused-vars': ['error', {args: 'none'}],

      // Other Code Style Overrides
      'prettier/prettier': 'error',
    },
  },
]
