/// <reference lib="WebWorker" />
/// <reference types="vite/client" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
import {
	type PrecacheEntry,
	cleanupOutdatedCaches,
	createHandlerBoundToURL,
	precacheAndRoute
} from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

declare let self: ServiceWorkerGlobalScope;

self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

// // self.__WB_MANIFEST is default injection point
precacheAndRoute(
	self.__WB_MANIFEST.filter((x) => {
		const entry = x as PrecacheEntry;
		return entry.url.includes('.') || entry.url === '/';
	})
);

// clean old assets
cleanupOutdatedCaches();

// to allow work offline
if (import.meta.env.PROD) registerRoute(new NavigationRoute(createHandlerBoundToURL('/')));

// Cache fonts
registerRoute(/fonts\.(googleapi|gstatic)\.com/, new CacheFirst({ cacheName: 'fonts' }));

// Cache assets temporarily
registerRoute(
	(req) => req.request.destination === 'image',
	new CacheFirst({
		cacheName: 'images',
		plugins: [new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 3600 })]
	})
);

// General API calls
registerRoute(
	(req) => req.request.destination === 'object',
	new NetworkFirst({
		cacheName: 'api',
		networkTimeoutSeconds: 10
	})
);
