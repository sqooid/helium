<script lang="ts">
	export let checked = false;

	const onClick = () => {
		checked = !checked;
	};
</script>

<button
	on:click={onClick}
	class={`h-8 p-1 w-14 ${
		checked ? 'dark:bg-primary' : 'dark:bg-dark2'
	} rounded-full flex transition-colors`}
>
	<div
		class={`pointer-events-none dark:bg-onDark rounded-full w-6 h-6 shadow-sm transition-transform ${
			checked ? 'translate-x-full' : ''
		}`}
	/>
</button>

<style lang="postcss">
</style>
