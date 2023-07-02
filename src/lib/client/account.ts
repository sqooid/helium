import { LemmyHttp } from 'lemmy-js-client';
import { makeClient } from './common';

export const checkDomain = async (domain: string) => {
	const url = `https://${domain}`;
	const client = makeClient(domain);
	console.log(__DOMAIN__);

	try {
		await client.getSiteMetadata({ url: 'https://lm.thesqooid.com' });
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
};

export const login = async (domain: string, user: string, password: string) => {
	const client = makeClient(domain);
	const result = await client.login({ username_or_email: user, password });
	return result.jwt;
};
