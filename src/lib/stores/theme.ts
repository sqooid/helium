import { writable } from 'svelte/store';
import { db } from '$lib/database/db';
import { defaultAccount, type Account } from '$lib/database/account';

const createCurrentAccountStore = () => {
	const { subscribe, set } = writable<Partial<Account>>({});
	return {
		subscribe,
		setAccount: async (domain: string, username: string) => {
			const account = await db.account.get({ instanceDomain: domain, username });
			if (account) {
				set(account);
				localStorage.setItem('currentAccount', `[${domain}+${username}]`);
				return true;
			} else {
				return false;
			}
		},
		init: async () => {
			const initialAccountId = localStorage.getItem('currentAccount');
			const initialAccount =
				initialAccountId === null
					? (await db.account.where('instanceDomain').notEqual('').first()) ?? defaultAccount
					: (await db.account.get(initialAccountId)) ?? defaultAccount;
			set(initialAccount);
		}
	};
};

export const currentAccount = createCurrentAccountStore();
