import { LemmyHttp, LemmyHttpError } from 'lemmy-js-client';
import { HeliumHttpError } from './error';

export const makeClient = (domain: string) => new LemmyHttp(`https://${__DOMAIN__}/api/${domain}`);

export class DBError extends Error {
	constructor(message: string) {
		super(message);
	}
}

export const fetchWrapper = async <T>(fn: () => Promise<T>) => {
	try {
		return fn();
	} catch (error) {
		if (error instanceof LemmyHttpError) {
			throw new HeliumHttpError(error.status, error.message);
		}
		throw error;
	}
};
