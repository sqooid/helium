import { writable } from 'svelte/store';

export const routeWrapper = writable<HTMLDivElement | null>(null);
