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
	const { r, g, b } = rgbFromRgbaNorm(darkBaseColor, { r: 1, g: 1, b: 1, a: 0.006666 * elev });
	acc[`dark${elev}`] = `rgb(${Math.floor(r * 255)},${Math.floor(g * 255)},${Math.floor(b * 255)})`;
	return acc;
}, {});
console.log(darkElevations);

export default {
	content: ['./src/**/*.{html,js,ts,svelte}'],
	theme: {
		extend: {
			colors: {
				primary: 'var(--primary)',
				textOnDark: '#ffffff',
				textOnLight: 'rgba(255,255,255,222)',
				...darkElevations
			},
			fontFamily: {
				roboto: ['Roboto', ...defaultTheme.fontFamily.sans]
			}
		}
	},
	plugins: []
};
