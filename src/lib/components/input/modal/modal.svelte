<script lang="ts">
	import { nodeInEvent } from '$lib/helpers/dom';

	export let show = false;
	let modalContent: HTMLDivElement;
	const onClickDocument = (e: MouseEvent) => {
		if (show && !nodeInEvent(modalContent, e)) {
			show = false;
		}
	};
	const onKeyDocument = (e: KeyboardEvent) => {
		if (e.key === 'Escape') show = false;
	};
</script>

<svelte:document on:click={onClickDocument} on:keypress={onKeyDocument} />

{#if show}
	<div
		class="fixed inset-0 z-30 bg-black dark:bg-black dark:bg-opacity-80 bg-opacity-70 flex items-center justify-center transition-colors"
	>
		<div
			class="dark:bg-dark16 shadow-lg max-w-[90%] max-h-[80%]"
			bind:this={modalContent}
			aria-modal="true"
		>
			<slot />
		</div>
	</div>
{/if}

<style lang="postcss">
</style>
