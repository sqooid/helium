<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';

	export let href: string;
	export let label = '';
	export let icon: any;

	$: selected = $page.url.pathname.indexOf(href) === 0;

	const onClick = () => {
		goto(href);
	};

	const dispatch = createEventDispatcher();
	const onRightClick = () => {
		dispatch('rightClick');
		return false;
	};

	console.log();
</script>

<button
	on:click={onClick}
	on:contextmenu|preventDefault={onRightClick}
	class="flex flex-col items-center justify-between gap-1 h-full aspect-square py-1.5"
>
	<div class="">
		<svelte:component
			this={icon}
			class={`h-5 select-none ${
				selected ? 'fill-primary dark:fill-primary' : 'dark:fill-onDark '
			} pointer-events-none`}
		/>
	</div>
	<span
		class={`font-roboto text-xs select-none ${
			selected ? 'text-primary dark:text-primary' : 'dark:text-white '
		} pointer-events-none`}>{label}</span
	>
</button>

<style lang="postcss">
</style>
