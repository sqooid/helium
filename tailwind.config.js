/** @type {import('tailwindcss').Config} */

import defaultTheme from 'tailwindcss/defaultTheme';

export default {
	content: ['./src/**/*.{html,js,ts,svelte}'],
	theme: {
		extend: {
			colors: {
				primary: 'var(--primary)',
				textOnDark: '#ffffff',
				textOnLight: 'rgba(255,255,255,222)',
				dark0: '#000000',
				dark1: '#0d0d0d',
				dark2: '#121212',
				dark3: '#141414'
			},
			fontFamily: {
				roboto: ['Roboto', ...defaultTheme.fontFamily.sans]
			}
		}
	},
	plugins: []
};
