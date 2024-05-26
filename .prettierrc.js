module.exports = {
  endOfLine: 'lf',
  useTabs: false,
  printWidth: 120,
  tabWidth: 2,
  singleQuote: true,
  bracketSpacing: true,
  trailingComma: 'es5',
  semi: true,
  plugins: [require('@trivago/prettier-plugin-sort-imports')],
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '^@/(.*)(?<!\\.[a-z0-9]{2,4})$',
    '^\\.\\./(.*)(?<!\\.[a-z0-9]{2,4})$',
    '^./(.*)(?<!\\.[a-z0-9]{2,4})$',
    '(\\.[a-z0-9]{2,4})$',
  ],
  importOrderSeparation: true,
  importOrderParserPlugins: ['typescript', 'classProperties', 'jsx'],
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,
};
