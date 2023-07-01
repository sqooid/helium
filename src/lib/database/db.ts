import { Dexie, type Table } from 'dexie';
import type { Account } from './account';

export class HeliumDexie extends Dexie {
	account!: Table<Partial<Account>>;

	constructor() {
		super('HeliumData');
		this.version(1).stores({
			account: '[instanceDomain+username]'
		});
	}
}

export const db = new HeliumDexie();
