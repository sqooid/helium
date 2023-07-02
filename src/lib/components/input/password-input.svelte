<script lang="ts">
	import { animateLayoutChanges } from '$lib/helpers/animation';

	export let label = '';
	export let value = '';
	export let hint = '';
	export let autocomplete = false;
	export let canError = false;
	export let errorText: string | null = null;

	let parentNode: HTMLElement;

	const animateLayoutChange = (node: HTMLElement) => {
		if (canError) animateLayoutChanges(node);
	};
	$: if (parentNode) animateLayoutChange(parentNode);
</script>

<label
	class={`flex flex-col gap-1 ${canError ? 'transition-[height]' : ''}`}
	bind:this={parentNode}
>
	<span class="font-light select-none text-sm">{label}</span>
	<input
		autocomplete={autocomplete ? 'on' : 'off'}
		type="password"
		name={label}
		bind:value
		class={`dark:bg-dark2 px-3 py-2 rounded-md placeholder:text-opacity-10 placeholder:text-white outline-none ${
			errorText !== null ? 'border border-error' : ''
		}`}
		placeholder={hint}
	/>
	{#if errorText}
		<span class="dark:text-error text-sm font-light">{errorText}</span>
	{/if}
</label>

<style lang="postcss">
</style>
