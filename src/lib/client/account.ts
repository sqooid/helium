import { LemmyHttp } from 'lemmy-js-client';

export const checkDomain = async (domain: string) => {
	const urlQuery = encodeURIComponent(`https://${domain}`);
	const url = `https://${domain}/api/v3/post/site_metadata?url=${urlQuery}`;
	const client = new LemmyHttp(url);
	try {
		// const result = await client.getSiteMetadata({ url });
		const result = await fetch(url, { method: 'GET' });
		console.log(result);

		return result;
	} catch (error) {
		console.log(error);
	}
};
