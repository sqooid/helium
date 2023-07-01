<script lang="ts">
	import { browser } from '$app/environment';
	import { pwaInfo } from 'virtual:pwa-info';
	import { useRegisterSW } from 'virtual:pwa-register/svelte';
	import '../app.css';
	import type { LayoutData } from './$types';
	import { slide } from 'svelte/transition';
	import BottomBar from '$lib/components/navigation/bottom-bar.svelte';
	import { currentAccount } from '$lib/stores/theme';

	$: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';

	$: if ($currentAccount) {
		document.documentElement.style.setProperty(
			'--primary',
			$currentAccount.themeColor ?? __THEME__
		);
	}

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

	export let data: LayoutData;
</script>

<svelte:head>
	{@html webManifestLink}
	<meta name="theme-color" content="#2de0a2" />
</svelte:head>
<div class="h-full w-screen fixed dark:bg-dark0">
	{#key data.currentPath}
		<div
			class="absolute w-full h-full pb-16"
			in:slide={{ axis: 'x', delay: 250, duration: 200 }}
			out:slide={{ axis: 'x', duration: 200 }}
		>
			<slot />
		</div>
	{/key}
	<BottomBar />
</div>

<style lang="postcss">
</style>
