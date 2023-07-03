import { LemmyHttp } from 'lemmy-js-client';

export const makeClient = (domain: string) => new LemmyHttp(`https://${__DOMAIN__}/api/${domain}`);

export class DBError extends Error {
	constructor(message: string) {
		super(message);
	}
}
