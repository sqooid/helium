import { writable } from 'svelte/store';

export type Toast = {
	type: 'success' | 'warning' | 'failure';
	title?: string;
	message?: string;
	durationMs?: number;
};

const createToastStore = () => {
	const { subscribe, set, update } = writable<Toast[]>([]);
	return {
		subscribe,
		show: (toast: Toast) => {
			update((toasts) => {
				toasts.push(toast);
				setTimeout(() => {
					const index = toasts.findIndex((x) => x === toast);
					toasts.splice(index, 1);
					set(toasts);
				}, toast.durationMs ?? 3000);
				return toasts;
			});
		}
	};
};

export const toast = createToastStore();
