import { getAccount, type Account, defaultAccount } from '$lib/database/account';
import { writable } from 'svelte/store';

const createCurrentAccountStore = () => {
	const { subscribe, set } = writable<Account>(defaultAccount);
	return {
		subscribe,
		setAccount: async (domain: string, username: string) => {
			const account = await getAccount({ domain, username });
			localStorage.setItem('currentAccount', JSON.stringify({ domain, username }));
			set({ ...defaultAccount, ...account });
		},
		init: async () => {
			const currentAccountString = localStorage.getItem('currentAccount') ?? '';
			const currentAccountId = currentAccountString ? JSON.parse(currentAccountString) : undefined;
			const currentAccount = await getAccount(currentAccountId);
			set({ ...defaultAccount, ...currentAccount });
		}
	};
};

export const currentAccount = createCurrentAccountStore();
