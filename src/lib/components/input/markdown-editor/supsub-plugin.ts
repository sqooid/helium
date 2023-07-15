import { remarkStringifyOptionsCtx, type Config } from '@milkdown/core';
import type { RemarkPlugin } from '@milkdown/transformer';
import { $mark, $markSchema, $remark } from '@milkdown/utils';
import type { Node } from 'mdast';
import type { Handle } from 'mdast-util-to-markdown';
import { visit } from 'unist-util-visit';
import { toggleMarkFixed } from './commands';

/**
 * Remark plugin
 */

const supersub: RemarkPlugin = () => (tree) => {
	// Superscript
	visit(tree, ['text'], (node, i, parent) => {
		if (node.type !== 'text' || i === undefined) {
			return;
		}

		const { value } = node;

		const values = value.split(/\^/);
		if (values.length === 1 || values.length % 2 === 0) {
			return;
		}

		const children = values.reduce((acc, str, i) => {
			if (!str) return acc;
			const node =
				i % 2 === 0
					? {
							type: 'text',
							value: str
					  }
					: {
							type: 'superscript',
							data: {
								hName: 'sup'
							},
							children: [
								{
									type: 'text',
									value: str
								}
							]
					  };
			acc.push(node);
			return acc;
		}, [] as any[]);
		parent?.children.splice(i, 1, ...(children as any));
	});

	// Strikethrough
	visit(tree, ['text'], (node, i, parent) => {
		if (node.type !== 'text') {
			return;
		}

		const { value } = node;

		// eslint-disable-next-line no-useless-escape
		const values = value.split(/\~\~/);
		if (values.length === 1 || values.length % 2 === 0) {
			return;
		}

		const children = values.reduce((acc, str, i) => {
			if (!str) return acc;
			const node =
				i % 2 === 0
					? {
							type: 'text',
							value: str
					  }
					: {
							type: 'strikethrough',
							data: {
								hName: 'sub'
							},
							children: [
								{
									type: 'text',
									value: str
								}
							]
					  };
			acc.push(node);
			return acc;
		}, [] as any[]);
		parent?.children.splice(i!, 1, ...(children as any));
	});

	// Subscript
	visit(tree, ['text'], (node, i, parent) => {
		if (node.type !== 'text') {
			return;
		}

		const { value } = node;

		// eslint-disable-next-line no-useless-escape
		const values = value.split(/\~/);
		if (values.length === 1 || values.length % 2 === 0) {
			return;
		}

		const children = values.reduce((acc, str, i) => {
			if (!str) {
				if (i % 2 === 1) {
					acc.push({ type: 'text', value: '~~' });
				}
				return acc;
			}
			const node =
				i % 2 === 0
					? {
							type: 'text',
							value: str
					  }
					: {
							type: 'subscript',
							data: {
								hName: 'sub'
							},
							children: [
								{
									type: 'text',
									value: str
								}
							]
					  };
			acc.push(node);
			return acc;
		}, [] as any[]);
		parent?.children.splice(i!, 1, ...(children as any));
	});
};

export const remarkSuperSubStrike = $remark(() => supersub);

/**
 * Mark schemas
 */

export const superscriptMark = $mark('superscript', () => ({
	spanning: false,
	inclusive: true,
	parseDOM: [{ tag: 'sup' }],
	toDOM: () => ['sup', 0],
	parseMarkdown: {
		match: (node) => node.type === 'superscript',
		runner: (state, node, proseType) => {
			state.openMark(proseType).next(node.children).closeMark(proseType);
		}
	},
	toMarkdown: {
		match: (mark) => mark.type.name === 'superscript',
		runner: (state, mark, node) => {
			state.withMark(mark, 'superscript');
		}
	}
}));

export const subscriptMark = $mark('subscript', () => ({
	spanning: false,
	inclusive: true,
	parseDOM: [{ tag: 'sub' }],
	toDOM: () => ['sub', 0],
	parseMarkdown: {
		match: (node) => node.type === 'subscript',
		runner: (state, node, proseType) => {
			state.openMark(proseType).next(node.children).closeMark(proseType);
		}
	},
	toMarkdown: {
		match: (mark) => mark.type.name === 'subscript',
		runner: (state, mark, node) => {
			state.withMark(mark, 'subscript');
		}
	}
}));

export const strikethroughMark = $mark('strikethrough', () => ({
	spanning: false,
	inclusive: true,
	parseDOM: [{ tag: 's' }],
	toDOM: () => ['s', 0],
	parseMarkdown: {
		match: (node) => node.type === 'strikethrough',
		runner: (state, node, proseType) => {
			state.openMark(proseType).next(node.children).closeMark(proseType);
		}
	},
	toMarkdown: {
		match: (mark) => mark.type.name === 'strikethrough',
		runner: (state, mark, node) => {
			state.withMark(mark, 'strikethrough');
		}
	}
}));

/**
 * Serializers
 */

export const supersubSerializer: Config = (ctx) => {
	ctx.update(remarkStringifyOptionsCtx, (o) => {
		Object.assign(o.handlers as { [k: string]: Handle }, supersubHandlers);
		return o;
	});
};

export const supersubHandlers: { [k: string]: Handle } = {
	superscript: (node, _, state, info) => {
		return `^${node.children[0].value}^`;
	},
	subscript: (node, _, state, info) => {
		return `~${node.children[0].value}~`;
	},
	strikethrough: (node, _, state, info) => {
		return `~~${node.children[0].value}~~`;
	}
};

const superscriptCommand = toggleMarkFixed('ToggleSuperscript', superscriptMark);
const subscriptCommand = toggleMarkFixed('ToggleSubscript', subscriptMark);
const strikethroughCommand = toggleMarkFixed('ToggleStrikethrough', strikethroughMark);

export const supersubPlugin = [
	remarkSuperSubStrike,
	superscriptMark,
	subscriptMark,
	strikethroughMark,
	superscriptCommand,
	subscriptCommand,
	strikethroughCommand
];
