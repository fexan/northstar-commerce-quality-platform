import eslint from '@eslint/js'
import prettier from 'eslint-config-prettier'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      'my-medusa-store/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      'automation/playwright-report/**',
      'automation/test-results/**',
      'automation/blob-report/**',
      'tmp/**',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    files: ['**/*.ts'],
    languageOptions: { globals: globals.node },
  },
)
