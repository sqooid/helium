import { currentAccount } from '$lib/stores/theme';
import { get } from 'svelte/store';

class HttpError extends Error {
	status: number;
	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

export const heliumFetch = (
	route: string,
	options: RequestInit,
	body?: object,
	target?: { domain: string; jwt?: string }
) => {
	const defaultAccount = get(currentAccount);
	const domain = target?.domain ?? defaultAccount.instanceDomain;
	const jwt = target?.jwt ?? defaultAccount.jwt;

	const response = fetch(`https://${domain}/api/v3${route}`);
};
