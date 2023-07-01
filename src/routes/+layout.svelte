<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import { Workbox } from 'workbox-window';
	import { browser } from '$app/environment';
	import { useRegisterSW } from 'virtual:pwa-register/svelte';
	import { pwaInfo } from 'virtual:pwa-info';

	$: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';

	if (browser) {
		const registerSW = useRegisterSW({
			onRegisteredSW(swScriptUrl, registration) {
				console.log(swScriptUrl, registration);
			},
			onRegisterError(error) {
				console.log(error);
			},
			onNeedRefresh() {
				console.log('updating');
				registerSW.updateServiceWorker(true);
			},
			onOfflineReady() {
				console.log('offline ready');
			},
			onRegistered(registration) {
				console.log(registration);
			}
		});
	}

	// if (browser && 'serviceWorker' in navigator) {
	// 	const wb = new Workbox('/sw.js');
	// 	wb.register();
	// }
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>
<slot />

<style lang="postcss">
</style>
