<script lang="ts">
	import { toast } from '$lib/stores/toast';
	import Toast from './Toast.svelte';
</script>

<div class={`${$$props.class} absolute w-full flex flex-col-reverse`}>
	{#each $toast as t}
		<Toast toast={t} />
	{/each}
</div>

<style lang="postcss">
</style>
