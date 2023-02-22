/** @type {import("prettier").Config} */
module.exports = {
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  semi: false,
  printWidth: 100,
  bracketSpacing: false,
  singleQuote: true,
  endOfLine: 'auto',
}
