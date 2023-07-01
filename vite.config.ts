import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			strategies: 'injectManifest',
			registerType: 'prompt',
			mode: 'development',
			injectRegister: 'auto',
			devOptions: { enabled: true, type: 'module' },
			base: '/',
			srcDir: 'src',
			filename: 'prompt-sw.ts',
			workbox: { sourcemap: true },
			manifest: {
				short_name: 'Helium',
				name: 'Helium for Lemmy',
				description: 'Mobile web-app client for Lemmy',
				start_url: '/',
				scope: '/',
				id: 'helium',
				theme_color: '#2de0a2',
				icons: [
					{
						src: '/helium.svg',
						type: 'image/svg+xml',
						sizes: '512x512'
					},
					{
						src: '/helium.png',
						type: 'image/png',
						sizes: '512x512'
					},
					{
						src: '/helium-144.svg',
						type: 'image/svg+xml',
						sizes: '144x144',
						purpose: 'any'
					},
					{
						src: '/helium-192.svg',
						type: 'image/svg+xml',
						sizes: '192x192',
						purpose: 'any'
					},
					{
						src: '/helium-maskable.svg',
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
