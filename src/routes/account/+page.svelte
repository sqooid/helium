<script lang="ts">
	import { goto } from '$app/navigation';
	import Kiwi from '$lib/components/icons/kiwi.svelte';
	import PlusIcon from '$lib/components/icons/plus-icon.svelte';
	import Button from '$lib/components/input/button.svelte';
	import { db } from '$lib/database/db';
	import { liveQuery } from 'dexie';
	const showTip = localStorage.getItem('showAccountTipDone') === null;

	const accounts = liveQuery(() => db.account.toArray());

	$: noAccounts = ($accounts ?? []).length < 2;

	const onClickAddAccount = () => {
		goto('/account/add');
	};
</script>

{#if noAccounts}
	<div class="h-full w-full flex flex-col items-center justify-center gap-4">
		<Kiwi class="dark:fill-onDark h-12" />
		<span class="font-thin">Register an account to get started</span>
		<Button ghost label="Add account" icon={PlusIcon} on:click={onClickAddAccount} />
	</div>
{/if}

{#if showTip}
	<div class="absolute bottom-0 w-full dark:bg-dark6 text-center h-fit py-2">
		<span
			class="text-sm font-thin
					"
		>
			Tip: Hold the Account button to quickly switch between accounts
		</span>
	</div>
{/if}

<style lang="postcss">
</style>
