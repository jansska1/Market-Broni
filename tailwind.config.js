/** @type {import('tailwindcss').Config} */
const { mauve, violet } = require('@radix-ui/colors')
module.exports = {
	content: ['./app/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				...mauve,
				...violet,
				error: 'rgb(255, 86, 54)',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				third: {
					DEFAULT: 'hsl(var(--third))',
				},
				forth: {
					DEFAULT: 'hsl(var(--forth))',
				},
				fifth: {
					DEFAULT: 'hsl(var(--fifth))',
				},
				sixth: {
					DEFAULT: 'hsl(var(--sixth))',
				},
				// primary: {
				// 	DEFAULT: 'hsl(var(--primary))',
				// 	foreground: 'hsl(var(--primary-foreground))',
				// },
				// secondary: {
				// 	DEFAULT: 'hsl(var(--secondary))',
				// 	foreground: 'hsl(var(--secondary-foreground))',
				// },
			},
			fontSize: {
				standard: '1rem',
			},
			fontFamily: {
				sans: ['var(--font-geist-sans)'],
			},
			height: {
				nav: '4.5rem',
			},
			marginTop: {
				nav: '4.5rem',
			},
			backgroundImage: {
				multicam: "url('/multi.webp')",
			},
		},
	},
	plugins: [],
}
