import { editorViewOptionsCtx, type Config } from '@milkdown/core';
import type { Ctx } from '@milkdown/ctx';
import {
	blockquoteAttr,
	codeBlockAttr,
	headingAttr,
	imageAttr,
	inlineCodeAttr
} from '@milkdown/preset-commonmark';

export const theme = (ctx: Ctx): void => {
	ctx.update(editorViewOptionsCtx, (prev) => {
		const prevClass = prev.attributes;

		return {
			...prev,
			attributes: (state) => {
				const attrs = typeof prevClass === 'function' ? prevClass(state) : prevClass;

				return {
					...attrs,
					class: `outline-none milkdown-theme ${attrs?.class || ''}`
				};
			}
		};
	});
};

export const editorStyle: Config = (ctx) => {
	ctx.set(headingAttr.key, (node) => {
		const level = node.attrs.level;
		if (level === 1) return { class: 'text-4xl', 'data-el-type': 'h1' };
		if (level === 2) return { class: 'text-3xl', 'data-el-type': 'h2' };
		if (level === 3) return { class: 'text-2xl', 'data-el-type': 'h3' };
		if (level === 4) return { class: 'text-xl', 'data-el-type': 'h4' };
		return { class: 'text-lg', 'data-el-type': 'h5' };
	});
	ctx.set(blockquoteAttr.key, () => {
		return {
			class: 'p-4 dark:bg-darkElev4 dark:border-l-4 dark:border-white shadow-md rounded-md'
		};
	});
	ctx.set(imageAttr.key, () => {
		return { class: 'w-full' };
	});
	ctx.set(inlineCodeAttr.key, () => {
		return {
			class: 'dark:bg-darkElev4 p-1 rounded'
		};
	});
	ctx.set(codeBlockAttr.key, () => {
		return {
			pre: {
				class: 'dark:bg-darkElev4 p-2 rounded w-full'
			},
			code: {}
		};
	});
};
