<script lang="ts">
	import type { Toast } from '$lib/stores/toast';
	import { flip } from 'svelte/animate';
	import { slide } from 'svelte/transition';

	export let toast: Toast;

	let color: string;
	switch (toast.type) {
		case 'warning':
			color = 'bg-warn text-onWarn';
			break;
		case 'failure':
			color = 'bg-error text-onError';
			break;
		default:
			color = 'bg-success text-onSuccess';
	}
</script>

<div class={`${color} w-full flex justify-center gap-1p py-1`} transition:slide={{ axis: 'y' }}>
	{#if toast.title}
		<span class="font-semibold">{toast.title}:</span>
	{/if}
	<span class={``}>{toast.message}</span>
</div>

<style lang="postcss">
</style>
