import { InputRule } from '@milkdown/prose/inputrules';
import { $inputRule, $node } from '@milkdown/utils';
import { $remark } from '@milkdown/utils';
import directive from 'remark-directive';
import { spacedDirective } from './spaced-directives';

export const remarkDirective = $remark(() => directive);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const remarkSpacedDirective = $remark(() => spacedDirective);
export const blockSpoilerNode = $node('spoiler', () => ({
	content: 'spoilerTitle block+',
	group: 'block',
	atom: false,
	isolating: true,
	marks: '_',
	parseDOM: [{ tag: 'details' }],
	toDOM: (node) => ['details', { ...node.attrs, open: true, class: 'bg-gray-900' }, 0],
	parseMarkdown: {
		match: (node) => {
			return node.type === 'spacedDirective' && node.name === 'spoiler';
		},
		runner: (state, node, proseType) => {
			state.openNode(proseType).next(node.children).closeNode();
		}
	},
	toMarkdown: {
		match: (node) => node.type.name === 'spoiler',
		runner: (state, node) => {
			state.openNode('spacedDirective', 'spoiler').next(node.content).closeNode();
		}
	}
}));

export const spanNode = $node('span', () => ({
	content: 'inline+',
	marks: '_',
	isolating: false,
	parseDOM: [{ tag: 'span' }],
	toDOM: (node) => ['span', { class: '', ...node.attrs }, 0],
	parseMarkdown: {
		match: (node) => node.type === 'span',
		runner: (state, node, proseType) => {
			state.openNode(proseType).next(node.children).closeNode();
		}
	},
	toMarkdown: {
		match: (node) => node.type.name === 'span',
		runner: (state, node) => {
			state.openNode('span').next(node.content).closeNode();
		}
	}
}));

export const blockSpoilerTitleNode = $node('spoilerTitle', () => ({
	content: 'span',
	marks: '_',
	isolating: false,
	parseDOM: [{ tag: 'summary' }],
	toDOM: (node) => ['summary', { class: 'text-white dark:bg-gray-800', ...node.attrs }, 0],
	parseMarkdown: {
		match: (node) => {
			return node.type === 'spacedDirectiveLabel';
		},
		runner: (state, node, proseType) => {
			state.openNode(proseType).next(node.children).closeNode();
			// state.addNode(proseType);
		}
	},
	toMarkdown: {
		match: (node) => node.type.name === 'spoilerTitle',
		runner: (state, node) => {
			// state.addNode('textDirective', undefined, undefined, { name: 'spoiler_title' });
			state.openNode('spacedDirectiveLabel').next(node.content).closeNode();
		}
	}
}));

export const blockSpoilerInputRule = $inputRule(
	(ctx) =>
		new InputRule(/^\s*:::\s*spoiler$/, (state, match, start, end) => {
			const [okay, title = ''] = match;
			const { tr } = state;
			console.log(title, tr);

			if (okay) {
				const newNode = blockSpoilerNode.type(ctx).createAndFill();
				if (newNode) tr.replaceWith(start - 1, end, newNode);
			}
			return tr;
		})
);
