import antfu from '@antfu/eslint-config'

const config = antfu({
  solid: !true,
  typescript: true,
  unocss: true,
  yaml: false,
  vue: false,
  formatters: true,

  stylistic: {
    indent: 2, // 4, or 'tab'
    quotes: 'single', // or 'double'
  },
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'unused-imports/no-unused-vars': 'warn',
    'style/jsx-one-expression-per-line': [0, { allow: 'non-jsx' }],
    'unicorn/consistent-function-scoping': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off', // 允许 混用interface或type 定义类型
  },
})

export default config
