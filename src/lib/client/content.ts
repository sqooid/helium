import { get } from 'svelte/store';
import { fetchWrapper, makeClient } from './common';
import { currentAccount } from '$lib/stores/theme';

export const uploadImage = async (file: File) => {
	return fetchWrapper(async () => {
		const user = get(currentAccount);
		const client = makeClient(user.domain);
		console.log(file);

		const result = await client.uploadImage({ image: file, auth: user.jwt });
		console.dir(result);

		return {
			url: result.url,
			deleteUrl: result.delete_url
		};
	});
};
