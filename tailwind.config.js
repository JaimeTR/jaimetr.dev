/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    safelist: [
        'text-primary-700',
        'dark:text-primary-400',
        'text-crusta-800',
        'dark:text-crusta-300',
        'font-bold',
        'underline',
        'text-left',
        'text-center',
        'text-right',
        'text-justify'
    ],
    theme: {
        extend: {
            animation: {
                'background-shine': 'background-shine 2s linear infinite',
            },
            keyframes: {
                'background-shine': {
                    from: { backgroundPosition: '0 0' },
                    to: { backgroundPosition: '-200% 0' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            fontFamily: {
                sans: ['Schibsted Grotesk Variable', 'Onest Variable', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                display: ['Schibsted Grotesk Variable', 'Onest Variable', 'sans-serif'],
                heading: ['Schibsted Grotesk Variable', 'Onest Variable', 'sans-serif'],
            },
            colors: {
                // Tokens del sitio (definidos en globals.css; cambian con el tema)
                bg: 'var(--bg)',
                raise: 'var(--raise)',
                ink: 'var(--ink)',
                'ink-2': 'var(--ink-2)',
                'ink-3': 'var(--ink-3)',
                rule: 'var(--rule)',
                accent: 'var(--accent)',
                'accent-ink': 'var(--accent-ink)',

                primary: {
                    50: '#effaff',
                    100: '#def3ff',
                    200: '#b6eaff',
                    300: '#75dbff',
                    400: '#2cc9ff',
                    500: '#00a8e8', //main
                    600: '#008fd4',
                    700: '#0072ab',
                    800: '#00608d',
                    900: '#065074',
                    950: '#04334d',
                },
                daintree: {
                    50: '#e9fffe',
                    100: '#c9fffe',
                    200: '#99ffff',
                    300: '#54fbff',
                    400: '#07edff',
                    500: '#00cfef',
                    600: '#00a4c9',
                    700: '#0082a1',
                    800: '#086882',
                    900: '#0c556d',
                    950: '#00171f',
                },
                crusta: {
                    50: '#fff6ed',
                    100: '#ffebd4',
                    200: '#ffd2a9',
                    300: '#ffb272',
                    400: '#fe7f2d',
                    500: '#fd6412',
                    600: '#ee4a08',
                    700: '#c53509',
                    800: '#9c2b10',
                    900: '#7e2610',
                    950: '#440f06',
                },
                dark: {
                    50: '#f2f8fd',
                    100: '#e3eff9',
                    200: '#c5dcee',
                    300: '#9fbfd9',
                    400: '#7f9bb8',
                    500: '#5f7f9d',
                    600: '#41607d',
                    700: '#14344f',
                    800: '#0e2a47',
                    900: '#0a1e33',
                    950: '#061320',
                },
            },
        },
    },
    darkMode: 'class',
    plugins: [],
}
