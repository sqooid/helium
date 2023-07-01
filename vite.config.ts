import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

const themeColor = '#2de0a2';

export default defineConfig({
	define: {
		'process.env.NODE_ENV':
			process.env.NODE_ENV === 'production' ? '"production"' : '"development"',
		__THEME__: JSON.stringify(themeColor)
	},
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			strategies: 'injectManifest',
			injectRegister: null,
			devOptions: { enabled: true, type: 'module' },
			base: '/',
			srcDir: 'src',
			filename: 'sw.ts',
			workbox: {
				sourcemap: true,
				globIgnores: ['**/[!index].html', '**/*'],
				globPatterns: ['nah'],
				globDirectory: 'build'
			},
			manifest: {
				short_name: 'Helium',
				name: 'Helium for Lemmy',
				description: 'Mobile web-app client for Lemmy',
				start_url: '/',
				scope: '/',
				id: 'helium',
				theme_color: themeColor,
				icons: [
					{
						src: '/icons/helium.svg',
						type: 'image/svg+xml',
						sizes: '512x512'
					},
					{
						src: '/icons/helium.png',
						type: 'image/png',
						sizes: '512x512'
					},
					{
						src: '/icons/helium-144.svg',
						type: 'image/svg+xml',
						sizes: '144x144',
						purpose: 'any'
					},
					{
						src: '/icons/helium-192.svg',
						type: 'image/svg+xml',
						sizes: '192x192',
						purpose: 'any'
					},
					{
						src: '/icons/helium-maskable.svg',
						type: 'image/svg+xml',
						sizes: '512x512',
						purpose: 'maskable'
					}
				],
				background_color: '#000',
				lang: 'en'
			}
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
