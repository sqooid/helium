export const nodeInEvent = (node: HTMLElement, e: Event) => {
	return e.target && (e.target === node || node.contains(e.target as Node));
};
