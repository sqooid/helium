<script lang="ts">
	import SettingsIcon from '../icons/settings-icon.svelte';
	import UserIcon from '../icons/user-icon.svelte';
	import WindowMaximizeIcon from '../icons/window-maximize-icon.svelte';
	import BottomBarButton from './bottom-bar-button.svelte';

	const onHoldAccount = () => {
		localStorage.setItem('showAccountTipDone', 'true');
	};
</script>

<div
	class="w-full h-12 dark:bg-dark8 absolute bottom-0 flex justify-around shadow-md border-t dark:border-darkElev8"
>
	<BottomBarButton label="Posts" icon={WindowMaximizeIcon} href="/feed" />
	<BottomBarButton label="Account" icon={UserIcon} href="/account" on:rightClick={onHoldAccount} />
	<BottomBarButton label="Settings" icon={SettingsIcon} href="/settings" />
</div>

<style lang="postcss">
</style>
