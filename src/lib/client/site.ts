import type { Account } from '$lib/database/account';
import type { GetSiteResponse } from 'lemmy-js-client';
import { fetchWrapper, makeClient } from './common';

export const getSite = async (account: {
	domain: string;
	jwt: string;
}): Promise<GetSiteResponse> => {
	return fetchWrapper(() => {
		const client = makeClient(account.domain);
		return client.getSite({ auth: account.jwt });
	});
};
