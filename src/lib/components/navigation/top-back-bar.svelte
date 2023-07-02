<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ArrowLeftIcon from '../icons/arrow-left-icon.svelte';

	export let title = '';
	const dispatch = createEventDispatcher();
	const onBack = () => {
		dispatch('back');
	};
</script>

<div class="w-full h-12 dark:bg-dark4 absolute top-0 flex items-center justify-center">
	<button
		on:click={onBack}
		class="absolute h-full left-0 aspect-square flex items-center justify-center"
	>
		<ArrowLeftIcon class="dark:fill-onDark h-5" />
	</button>
	<span class="text-xl">{title}</span>
</div>

<style lang="postcss">
</style>
