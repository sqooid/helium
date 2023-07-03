import { getAccount, type Account } from '$lib/database/account';
import { writable } from 'svelte/store';

const createCurrentAccountStore = () => {
	const { subscribe, set } = writable<Partial<Account>>({});
	return {
		subscribe,
		setAccount: async (domain: string, username: string) => {
			const account = await getAccount({ domain, username });
			localStorage.setItem('currentAccount', JSON.stringify({ domain, username }));
			set(account);
		},
		init: async () => {
			const currentAccountString = localStorage.getItem('currentAccount') ?? '';
			const currentAccount = currentAccountString ? JSON.parse(currentAccountString) : undefined;
			set(await getAccount(currentAccount));
		}
	};
};

export const currentAccount = createCurrentAccountStore();
