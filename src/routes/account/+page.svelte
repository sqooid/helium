<script lang="ts">
	import { goto } from '$app/navigation';
	import { getSite } from '$lib/client/site';
	import Kiwi from '$lib/components/icons/kiwi.svelte';
	import PlusIcon from '$lib/components/icons/plus-icon.svelte';
	import Button from '$lib/components/input/button.svelte';
	import MarkdownEditor from '$lib/components/input/markdown-editor/markdown-editor.svelte';
	import { db } from '$lib/database/db';
	import { currentAccount } from '$lib/stores/theme';
	import { createQuery } from '@tanstack/svelte-query';
	import { liveQuery } from 'dexie';
	const showTip = localStorage.getItem('showAccountTipDone') === null;

	const accounts = liveQuery(() => db.account.toArray());

	$: noAccounts = ($accounts ?? []).length < 2;

	const onClickAddAccount = () => {
		goto('/account/add');
	};

	$: siteQuery = createQuery({
		queryKey: [$currentAccount.domain, $currentAccount.displayName],
		queryFn: () => getSite($currentAccount),
		enabled: !!$currentAccount.domain
	});
</script>

<svelte:head>
	<title>Accounts</title>
</svelte:head>

{#if noAccounts}
	<div class="h-full w-full flex flex-col items-center justify-center gap-4">
		<Kiwi class="dark:fill-onDark h-12" />
		<span class="font-thin">Register an account to get started</span>
		<Button ghost label="Add account" icon={PlusIcon} on:click={onClickAddAccount} />
	</div>
{:else}
	<div class="flex flex-col gap-2 p-6 w-full h-full">
		<div class="w-full">
			<div class="">
				<span class="text-lg">{$currentAccount.username}</span>
				<span class="text-lg font-light text-opacity-40">@{$currentAccount.domain}</span>
			</div>
		</div>
		<MarkdownEditor />
	</div>
{/if}

{#if showTip}
	<div class="absolute bottom-0 w-full dark:bg-dark6 text-center h-fit py-1">
		<span class="text-sm font-thin"> Tip: Hold the Account button to switch between accounts </span>
	</div>
{/if}

<style lang="postcss">
</style>
