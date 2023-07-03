<script lang="ts">
	import { browser } from '$app/environment';
	import LoadingCircleIcon from '$lib/components/icons/loading-circle-icon.svelte';
	import BottomBar from '$lib/components/navigation/bottom-bar.svelte';
	import { pickTextColorBasedOnBgColor } from '$lib/helpers/color';
	import { currentAccount } from '$lib/stores/theme';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { pwaInfo } from 'virtual:pwa-info';
	import { useRegisterSW } from 'virtual:pwa-register/svelte';
	import '../app.css';
	import type { LayoutData } from './$types';
	import ToastBar from '$lib/components/ToastBar.svelte';

	$: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';

	$: if ($currentAccount) {
		document.documentElement.style.setProperty(
			'--primary',
			$currentAccount.themeColor ?? __THEME__
		);
		const onPrimaryColor = pickTextColorBasedOnBgColor(
			$currentAccount.themeColor ?? __THEME__,
			'#ffffff',
			'#121212'
		);

		document.documentElement.style.setProperty('--on-primary', onPrimaryColor);
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

	const queryClient = new QueryClient({ defaultOptions: { queries: { enabled: browser } } });
</script>

<!-- svelte-ignore missing-declaration -->
<svelte:head>
	{@html webManifestLink}
	<meta name="theme-color" content={__THEME__} />
</svelte:head>
<QueryClientProvider client={queryClient}>
	<div class="h-full w-screen fixed dark:bg-dark0">
		{#key data.currentPath}
			<div class="absolute w-full top-0 bottom-12">
				{#await currentAccount.init()}
					<LoadingCircleIcon />
				{:then}
					<slot />
				{/await}
			</div>
		{/key}
		<ToastBar class="bottom-12" />
		<BottomBar />
	</div>
</QueryClientProvider>

<style lang="postcss">
</style>
