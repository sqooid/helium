<script lang="ts">
	export let icon: any;
	export let active = false;
</script>

<button
	on:mousedown|preventDefault
	class={`h-12 aspect-square py-3 px-2 ${`${
		active ? 'dark:bg-darkElev4 shadow-md' : ''
	}`} flex justify-center items-center transition-colors duration-100`}
>
	<svelte:component this={icon} class={`dark:fill-onDark fill-onLight h-5`} />
</button>

<style lang="postcss">
</style>
