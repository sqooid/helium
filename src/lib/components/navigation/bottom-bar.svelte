<script lang="ts">
	import SettingsIcon from '../icons/settings-icon.svelte';
	import WindowMaximizeIcon from '../icons/window-maximize-icon.svelte';
	import BottomBarButton from './bottom-bar-button.svelte';

	export let selectedIndex: number;
</script>

<div class="w-full h-16 dark:bg-dark3 absolute bottom-0 flex justify-around">
	<BottomBarButton label="Posts" icon={WindowMaximizeIcon} href="/home" />
	<BottomBarButton label="Settings" icon={SettingsIcon} href="/settings" />
</div>

<style lang="postcss">
</style>
