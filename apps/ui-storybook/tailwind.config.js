/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
export default {
    mode: 'jit',
    darkMode: 'class',
    content: ['./src/**/*.{ts,tsx,js,jsx}', './node_modules/@wallet/**/*.{tsx,ts}'],
    theme: {
      fontSize: {
        h1: '32px',
        h2: '24px',
        h3: '20px',
        h4: '18px',
        subHeader: '18px',
        base: '16px',
        tiny: '14px',
        button: '20px',
        menu: '14px'
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
          white: 'var(--white)'
        },
        borderColor: {
          ui04: 'var(--ui04)',
        },
        backgroundImage: {
  
        },
        opacity: {
          6: '.06'
        }
      }
    },
    variants: { extend: { typography: ['dark'] } },
    plugins: [require('postcss-nested')]
  }
  