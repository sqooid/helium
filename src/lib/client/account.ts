import { makeClient } from './common';
import { LemmyHttpError } from 'lemmy-js-client';
import { HeliumHttpError } from './error';

export const checkDomain = async (domain: string) => {
	const client = makeClient(domain);
	try {
		await client.getSiteMetadata({ url: 'https://lm.thesqooid.com' });
		return true;
	} catch (error) {
		return false;
	}
};

export const login = async (domain: string, user: string, password: string) => {
	const client = makeClient(domain);
	try {
		const result = await client.login({ username_or_email: user, password });
		return result.jwt;
	} catch (error) {
		if (error instanceof LemmyHttpError) {
			throw new HeliumHttpError(error.status, error.message);
		}
	}
};
