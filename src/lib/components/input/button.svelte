<script lang="ts">
	import { afterUpdate, createEventDispatcher } from 'svelte';
	import LoadingCircleIcon from '../icons/loading-circle-icon.svelte';
	import { animateLayoutChanges } from '$lib/helpers/animation';

	export let label = '';
	export let icon: any = null;
	export let ghost = false;
	export let disabled = false;
	export let loading: boolean | null = null;
	export let canEnter = false;

	let buttonNode: HTMLButtonElement;

	const animateButtonLayout = (node: HTMLButtonElement) => {
		if (loading !== null) animateLayoutChanges(node);
	};
	$: if (buttonNode) animateButtonLayout(buttonNode);

	const dispatch = createEventDispatcher();
	const onClick = () => {
		dispatch('click');
	};
	if (canEnter) {
		document.addEventListener('keypress', (e) => {
			if (e.key === 'Enter') onClick();
		});
	}
</script>

<button
	bind:this={buttonNode}
	aria-label={label}
	disabled={disabled && loading && false}
	on:click={onClick}
	class={`flex gap-2 items-center p-3 ${ghost ? '' : 'bg-primary'} rounded-xl ${
		disabled ? 'opacity-40' : ''
	} active:opacity-70 duration-75 transition-all`}
>
	{#if icon}
		<svelte:component
			this={icon}
			class={`${ghost ? 'dark:fill-onDark fill-onLight' : 'fill-onPrimary'} h-4`}
		/>
	{/if}
	<span
		class={`${
			ghost ? 'dark:text-onDark text-onLight' : 'text-onPrimary'
		} select-none pointer-events-none`}>{label}</span
	>
	{#if loading}
		<LoadingCircleIcon class={`${ghost ? 'stroke-onDark' : 'stroke-onPrimary'} h-4`} />
	{/if}
</button>

<style lang="postcss">
</style>
