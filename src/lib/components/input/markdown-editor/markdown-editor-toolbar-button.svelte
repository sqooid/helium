<script lang="ts">
	export let icon: any;
	export let active = false;
</script>

<button
	on:mousedown|preventDefault
	class={`h-12 aspect-square py-3 px-2 ${`${
		active ? 'dark:bg-white shadow-md' : 'bg-transparent'
	} dark:bg-opacity-10 `} flex justify-center items-center`}
>
	<svelte:component this={icon} class={`dark:fill-onDark fill-onLight h-5`} />
</button>

<style lang="postcss">
</style>
