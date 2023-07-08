import type { Parent, PhrasingContent, Root, Paragraph } from 'mdast';
import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';

const openRegex = /^\s*:::\s*spoiler\s+(.+)$/;
const closeRegex = /^\s*:::\s*$/;

type SplitBufferNode =
	| { type: 'paragraph'; children: PhrasingContent[] }
	| { type: 'spoiler'; title: PhrasingContent[] };

interface Spoiler extends Parent {
	type: 'spoiler';
}

const parseSpoiler = (parent: Parent, i: number, node: Paragraph) => {
	const insertChildren = [];
	let titleStartIndex = -1;
	let titlePretext = '';
	for (let i = 0; i < node.children.length; ++i) {
		const child = node.children[i];
		if (child.type !== 'text') continue;
		const match = child.value.match(openRegex);
		if (match) {
			if (i > 0) {
				insertChildren.push({ type: 'paragraph', children: node.children.slice(0, i) });
			}
			titleStartIndex = i;
			titlePretext = match[1] ?? '';
			child.value = titlePretext;
			break;
		}
	}

	// No spoiler started
	if (titleStartIndex < 0) return;

	let titleEndIndex = -1;
	for (let i = titleStartIndex + 1; i < node.children.length; ++i) {
		const child = node.children[i];
		if (child.type === 'break') {
			titleEndIndex = i - 1;
			break;
		}
	}
	const titleNode = {
		type: 'spoilerTitle',
		children: [{ type: 'span', children: node.children.slice(titleStartIndex, titleEndIndex + 1) }]
	};
	const spoilerNode = { type: 'spoiler', children: [titleNode] };
	insertChildren.push(spoilerNode);
	parent.children.splice(i, 1, ...(insertChildren as any));
};

const transformContent = (parent: Parent) => {
	console.log('before', parent);
	const state = 0;
	parent.children.forEach((x, i) => {
		// Recurse
		if (x.type !== 'paragraph' && 'children' in x && x.children?.length > 0) {
			transformContent(x);
		}

		// Extract potential spoilers
		if (x.type === 'paragraph') {
			parseSpoiler(parent, i, x);
			console.log('after', parent);
		}
	});
	return;
};

export const spacedDirective = () => (tree: Root) => {
	// console.log(tree, file);
	transformContent(tree);
	return;
	visit(tree, 'paragraph', (node, idx, root) => {
		let i = 0;

		// Loop in case multiple spoilers in a single paragraph
		while (i < node.children.length) {
			// Find spoiler start
			let titleStart = -1;
			let titleText = '';
			const childCount = node.children.length;
			for (; i < childCount; ++i) {
				const child = node.children[i];

				// Find start of spoiler
				const text = toString(child);
				const match = text.match(openRegex);
				if (!match) continue;
				titleText = match[1];
				titleStart = i;
				break;
			}
			// No spoiler start in entire paragraph
			if (titleStart < 0) break;

			// Find spoiler end
			let titleEnd = -1;
			for (i = i + 1; i < childCount; ++i) {
				const child = node.children[i];
				if (child.type === 'break') {
					titleEnd = i - 1;
					break;
				}
			}

			let tailParagraph = [];
			let spoilerTitle = [];
			let spoilerContent = [];
			// Spoiler is open-ended
			if (titleEnd < 0) {
				//todo
			}

			// Find end of spoiler
			let spoilerEnd = -1;
			for (; i < childCount; ++i) {
				const child = node.children[i];
				if (child.type === 'text') {
					const match = child.value.match(closeRegex);
					if (match) {
						spoilerEnd = i;
					}
				}
			}

			// Spoiler also open-ended
			if (spoilerEnd < 0) {
				//todo
			}

			// Have to split paragraph if in the middle
			if (spoilerEnd < childCount - 1) {
				tailParagraph = node.children.splice(spoilerEnd + 2);
				node.children.pop(); // Get rid of extra newline
				node.children.pop(); // Get rid of spoiler end

				spoilerContent = node.children.splice(titleEnd + 2);
				node.children.pop(); // Get rid of extra newline

				const titleNode = node.children[titleStart];
				if (titleText && titleNode.type === 'text') {
					titleNode.value = titleText;
				}
				spoilerTitle = node.children.splice(titleText ? titleStart : titleStart + 1);
				if (!titleText) node.children.pop(); // Get rid of spoiler start if no raw text beside it
			}
		}
	});
};
