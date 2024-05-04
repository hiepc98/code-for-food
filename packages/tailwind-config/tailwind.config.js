import colors from './colors'
import typography from './typography'

module.exports = {
  // important: true,
  mode: 'jit',
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx,js,jsx}',
    './node_modules/@wallet/**/*.{tsx,ts}'
  ],
  theme: {
    fontSize: {
      h1: '32px',
      h2: '24px',
      h3: '20px',
      sub: '18px',
      base: '16px',
      tiny: '14px',
      button: '20px',
      menu: '14px',
      title: '40px',
      ...typography
    },
    extend: {
      colors: {
        ui04: 'var(--ui04)',
        ui03: 'var(--ui03)',
        ui02: 'var(--ui02)',
        ui01: 'var(--ui01)',
        ui00: 'var(--ui00)',

        primary: 'var(--primary)',
        blue: 'var(--blue)',
        green: 'var(--green)',
        orange: 'var(--orange)',
        red: 'var(--red)',
        black: 'var(--black)',
        white: 'var(--white)',
        purple: 'var(--purple)',
        pink: 'var(--pink)',
        'primary-bold': 'var(--primary-bold)',
        'gradient-from': 'var(--gradient-from)',
        'gradient-to': 'var(--gradient-to)',
        'red-thin': 'var(--red-thin)',
        'red-bold': 'var(--red-bold)',
        'green-light': 'var(--green-light)',
        'green-board': 'var(--green-board)',
        'yellow-bold': 'var(--yellow-bold)',
        'orange-bold': 'var(--orange-bold)',
        'blue-light': 'var(--blue-light)',
        'purple-light': 'var(--purple-light)',
        ...colors
      },
      backgroundImage: {
        hero: 'var(--bacground-image)'
      },
      opacity: {
        6: '.06'
      }
    }
  },
  variants: { extend: { typography: ['dark'] } },
  plugins: [require('postcss-nested')]
}