export type Account = {
	selected: boolean;
	// Account info
	instanceDomain: string;
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
