import { mapValues } from 'lodash-es';

export type FieldErrors<T extends object> = {
	[field in keyof T]: string | null;
};

export const defaultFieldErrors = <T extends object>(fields: T): FieldErrors<T> =>
	mapValues(fields, () => null);
