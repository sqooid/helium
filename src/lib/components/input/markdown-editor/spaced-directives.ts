import { remarkStringifyOptionsCtx, type Config } from '@milkdown/core';
import type { RemarkPlugin } from '@milkdown/transformer';
import type { Paragraph, Parent, Root } from 'mdast';
import type { Handle } from 'mdast-util-to-markdown';

/**
 * Parsers
 */
/* eslint-disable  @typescript-eslint/no-explicit-any */

const openRegex = /^\s*:::\s*(\S+)\s+(.*)$/;
const closeRegex = /^\s*:::\s*$/;

const parseSpacedDirective = (parent: Parent, indexInParent: number, node: Paragraph) => {
	const insertChildren = [];
	let titleStartIndex = -1;
	let directiveName = '';
	let titlePretext = '';

	// Find directive start
	for (let i = 0; i < node.children.length; ++i) {
		const child = node.children[i];
		if (child.type !== 'text') continue;
		const match = child.value.match(openRegex);

		if (!match) continue;

		if (i > 0) {
			insertChildren.push({ type: 'paragraph', children: node.children.slice(0, i) });
		}
		titleStartIndex = i;
		directiveName = match[1];
		titlePretext = match[2] ?? '';
		child.value = titlePretext;
		break;
	}

	// No spoiler started
	if (titleStartIndex < 0) return;

	// Find directive label end
	let titleEndIndex = -1;
	for (let i = titleStartIndex + 1; i < node.children.length; ++i) {
		const child = node.children[i];
		if (child.type === 'break') {
			titleEndIndex = i - 1;
			break;
		}
	}
	const labelNode = {
		type: 'spacedDirectiveLabel',
		children: [{ type: 'span', children: node.children.slice(titleStartIndex, titleEndIndex + 1) }]
	};
	const containerNode = { type: 'spacedDirective', name: directiveName, children: [labelNode] };
	insertChildren.push(containerNode);

	const spliceCount = insertChildren.length;

	if (titleEndIndex < node.children.length - 2) {
		const leftoverContent = { type: 'paragraph', children: node.children.slice(titleEndIndex + 2) };
		insertChildren.push(leftoverContent);
	}
	parent.children.splice(indexInParent, 1, ...(insertChildren as any));

	// Find the content
	const contentStartIndex = indexInParent + spliceCount;
	for (let j = contentStartIndex; j < parent.children.length; ++j) {
		const child = parent.children[j];
		if (child.type === 'paragraph') {
			const endLine = child.children.findIndex(
				(x) => x.type === 'text' && closeRegex.test(x.value)
			);
			if (endLine < 0) continue;

			const beforeEnd = { type: 'paragraph', children: child.children.slice(0, endLine - 1) };
			const afterEnd = { type: 'paragraph', children: child.children.slice(endLine + 2) };
			const innerContent: any[] = parent.children.splice(contentStartIndex, j - contentStartIndex);

			let hasPreceding = false;
			if (endLine > 0 && beforeEnd.children.length > 0) {
				hasPreceding = true;
				innerContent.push(beforeEnd);
			}

			parent.children.splice(contentStartIndex, 1, afterEnd as any);
			containerNode.children.push(...innerContent);
			return hasPreceding;
		}
	}
};

const transformContent = (parent: Parent) => {
	for (let i = 0; i < parent.children.length; ++i) {
		const child = parent.children[i];
		// Recurse
		if (child.type !== 'paragraph' && 'children' in child && child.children?.length > 0) {
			transformContent(child);
		}

		// Extract potential spoilers
		if (child.type === 'paragraph') {
			const hasPreceding = parseSpacedDirective(parent, i, child);
			if (hasPreceding) ++i;
		}
	}
};

export const spacedDirective: RemarkPlugin = () => (tree) => {
	transformContent(tree as Root);
	return;
};

/**
 * Serializers
 */

export const spacedDirectiveSerializer: Config = (ctx) => {
	ctx.update(remarkStringifyOptionsCtx, (o) => {
		Object.assign(o.handlers as { [k: string]: Handle }, spacedDirectiveHandlers);
		return o;
	});
};

export const spacedDirectiveHandlers: { [k: string]: Handle } = {
	spacedDirective: (node, _, state, info) => {
		const tracker = state.createTracker(info);
		let value = tracker.move(`:::${node.value} `);
		value += tracker.move(state.containerFlow(node, tracker.current()));
		value += tracker.move('\n\n:::');
		return value;
	},
	spacedDirectiveLabel: (node, _, state, info) => {
		const tracker = state.createTracker(info);
		const value = tracker.move(state.containerFlow(node, tracker.current()));
		return value;
	},
	span: (node, _, state, info) => {
		const tracker = state.createTracker(info);
		const value = tracker.move(
			state.containerPhrasing(node, { before: '', after: '', ...tracker.current() })
		);
		return value;
	}
};
