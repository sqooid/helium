import { DBError } from '$lib/client/common';
import { db } from './db';

export type AccountInfo = {
	domain: string; // If empty (along with username), inidicates community-level config
	displayName: string; // If empty, indicates default (anon) account-level config
	username: string;
	userId: number;
	personId: number;
	email: string;
	pfpUrl: string;
	jwt: string;
};

export type Settings = {
	themeColor: string;
	darkMode: boolean;
};

export type Account = {
	// Identifiers
	id?: number;
	community: string; // If empty, indicates any account-level config
} & AccountInfo &
	Settings;

export const defaultAccount: Account = {
	domain: 'lemmy.world',
	displayName: '',
	username: '',
	community: '',
	userId: 0,
	personId: 0,
	email: '',
	jwt: '',
	pfpUrl: '',

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

export const addAccount = async (params: AccountInfo) => {
	return db.account.add(params).catch('ConstraintError', () => {
		throw new DBError('Account is already registed');
	});
};
