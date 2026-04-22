/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				brand: {
					magenta: '#D80041',
					blue: {
						light: '#E1EBF2',
					},
					grey: {
						dark: '#54595F',
					},
					black: '#111111',
				}
			},
			fontFamily: {
				outfit: ['Outfit', 'sans-serif'],
			},
			animation: {
				'fade-in': 'fadeIn 0.5s ease-out forwards',
				'slide-up': 'slideUp 0.6s ease-out forwards',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				slideUp: {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				}
			}
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
}
