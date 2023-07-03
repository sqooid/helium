import { DBError } from '$lib/client/common';
import { db } from './db';

export type Account = {
	selected: boolean;
	// Account info
	domain: string;
	username: string;
	pfpUrl: string;
	jwt: string;
	// Settings
	themeColor: string;
	darkMode: boolean;
};

export const defaultAccount: Partial<Account> = {
	themeColor: __THEME__,
	darkMode: window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches
};

export const getAccount = async (params?: { domain: string; username: string }) => {
	let account = null;
	if (params) {
		account = await db.account.get(params);
	}
	if (!account) {
		account =
			(await db.account.where('domain').notEqual('').first()) ??
			(await db.account.where('domain').equals('').first()) ??
			defaultAccount;
	}
	return account;
};

export const addAccount = async (params: { domain: string; username: string; jwt: string }) => {
	return db.account.add(params).catch('ConstraintError', () => {
		throw new DBError('Account is already registed');
	});
};
