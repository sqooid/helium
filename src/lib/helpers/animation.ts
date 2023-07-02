export const animateLayoutChanges = (e: HTMLElement) => {
	const { width, height } = e.getBoundingClientRect();
	e.style.setProperty('width', `${width}px`);
	e.style.setProperty('height', `${height}px`);
	const observer = new MutationObserver(() => {
		const width = e.style.width;
		const height = e.style.height;
		e.style.removeProperty('width');
		e.style.removeProperty('height');

		let newWidth: number, newHeight: number;
		const ro1 = new ResizeObserver((_, o1) => {
			if (e.style.width !== width || e.style.height !== height) {
				const rect = e.getBoundingClientRect();
				newWidth = rect.width;
				newHeight = rect.height;
				e.style.width = width;
				e.style.height = height;
			} else {
				o1.disconnect();
				clearTimeout(t1);
				e.style.width = `${newWidth}px`;
				e.style.height = `${newHeight}px`;
			}
		});
		ro1.observe(e);
		const t1 = setTimeout(() => {
			ro1.disconnect();
		}, 500);
	});
	observer.observe(e, { childList: true });
};
