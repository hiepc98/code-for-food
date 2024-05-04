/**
 * @type {import('postcss').ProcessOptions}
 */
module.exports = {
  plugins: {
    'tailwindcss/nesting': 'postcss-nested',
    tailwindcss: {},
    autoprefixer: {}
  }
}
