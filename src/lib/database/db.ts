import { Dexie, type Table } from 'dexie';
import { defaultAccount, type Account } from './account';

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

const generateDefaultAccount = async () => {
	if ((await db.account.count()) === 0) {
		const newAccount = { ...defaultAccount, instanceDomain: '', username: '' };
		db.account.add(newAccount);
	}
};

generateDefaultAccount();
