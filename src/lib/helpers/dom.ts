export const nodeInEvent = (node: HTMLElement, e: Event) => {
	return e.target && (e.target === node || node.contains(e.target as Node));
};

export const getFileInput = async (
	callback: (files: File[] | null) => void,
	options?: { fileTypes?: string[]; multiple?: boolean }
) => {
	const node = document.createElement('input');
	node.type = 'file';
	node.multiple = options?.multiple ?? false;
	node.accept = options?.fileTypes ? options?.fileTypes.join(', ') : '';
	document.body.appendChild(node);
	node.click();
	node.addEventListener('change', () => {
		const files: File[] = [];
		for (let i = 0; i < (node.files?.length ?? 0); ++i) {
			const item = node.files?.item(i);
			if (item) files.push(item);
		}
		callback(files);
	});
	document.body.removeChild(node);
};
