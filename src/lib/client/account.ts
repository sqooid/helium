import { fetchWrapper, makeClient } from './common';

export const checkDomain = async (domain: string) => {
	const client = makeClient(domain);
	try {
		await client.getSiteMetadata({ url: `https://${domain}` });
		return true;
	} catch (error) {
		return false;
	}
};

export const login = async (domain: string, user: string, password: string) => {
	return fetchWrapper(async () => {
		const client = makeClient(domain);
		return client.login({ username_or_email: user, password }).then((x) => x.jwt);
	});
};
