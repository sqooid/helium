/** @type {import('tailwindcss').Config} */

import defaultTheme from 'tailwindcss/defaultTheme';

const rgbFromRgbaNorm = (background, foreground) => {
	return {
		r: foreground.a * foreground.r + (1 - foreground.a) * background.r,
		g: foreground.a * foreground.g + (1 - foreground.a) * background.g,
		b: foreground.a * foreground.b + (1 - foreground.a) * background.b
	};
};

const darkBaseColor = { r: 18 / 255, g: 18 / 255, b: 18 / 255 };
const darkElevations = [...Array(40).keys()].reduce((acc, elev) => {
	const { r, g, b } = rgbFromRgbaNorm(darkBaseColor, { r: 1, g: 1, b: 1, a: 0.01 * elev });
	acc[`dark${elev}`] = `rgb(${Math.floor(r * 255)},${Math.floor(g * 255)},${Math.floor(b * 255)})`;
	return acc;
}, {});

export default {
	content: ['./src/**/*.{html,js,ts,svelte}'],
	theme: {
		extend: {
			colors: {
				error: '#cf6679',
				onError: '#ffffff',
				success: '#37bd66',
				onSuccess: '#ffffff',
				warning: '#bdaf37',
				onWarning: '#ffffff',
				primary: 'var(--primary)',
				onPrimary: 'var(--on-primary)',
				onDark: '#ffffff',
				OnLight: 'rgba(255,255,255,222)',
				...darkElevations
			},
			fontFamily: {
				roboto: ['Roboto', ...defaultTheme.fontFamily.sans]
			}
		}
	},
	plugins: []
};
