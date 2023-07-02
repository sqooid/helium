<script lang="ts">
	import { animateLayoutChanges } from '$lib/helpers/animation';
	import LoadingCircleIcon from '../icons/loading-circle-icon.svelte';

	export let label = '';
	export let value = '';
	export let hint = '';
	export let autocomplete = false;
	export let canError = false;
	export let errorText: string | null = null;
	export let loading = false;

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
	<div class="relative w-full">
		<input
			autocomplete={autocomplete ? 'on' : 'off'}
			type="text"
			name={label}
			bind:value
			class={`dark:bg-dark2 px-3 py-2 rounded-md placeholder:text-opacity-10 placeholder:text-white outline-none ${
				errorText !== null ? 'border border-error' : ''
			} w-full dark:autofill:bg-dark2`}
			placeholder={hint}
		/>
		{#if loading}
			<div
				class="absolute right-4 top-0 bottom-0 flex flex-col justify-center select-none pointer-events-none"
			>
				<LoadingCircleIcon class="dark:stroke-onDark h-4" />
			</div>
		{/if}
	</div>
	{#if errorText}
		<span class="dark:text-error text-sm font-light">{errorText}</span>
	{/if}
</label>

<style lang="postcss">
</style>
