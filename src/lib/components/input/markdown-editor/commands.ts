import {
	emphasisSchema,
	headingSchema,
	inlineCodeSchema,
	paragraphSchema,
	strongSchema
} from '@milkdown/preset-commonmark';
import { setBlockType } from '@milkdown/prose/commands';
import { $command, type $MarkSchema } from '@milkdown/utils';
import type { MarkType } from 'prosemirror-model';
import { blockSpoilerNode, blockSpoilerTitleNode, spanNode } from './spoiler-plugin';

export const createSpoilerCommand = $command(
	'CreateSpoiler',
	(ctx) => () => (state, dispatch, view) => {
		const span = spanNode.type(ctx).create(null, state.schema.text('spoiler'));
		const title = blockSpoilerTitleNode.type(ctx).create(null, span);
		if (!state.selection.empty) {
			let content = state.selection.content().content;
			content = content.addToStart(title);
			console.log(content);

			const { from, to } = state.selection;
			dispatch?.(state.tr.replaceWith(from, to, blockSpoilerNode.type(ctx).create(null, content)));
			return true;
		}
		const node = blockSpoilerNode.type(ctx).createAndFill(null, [title]);
		if (!node) return false;
		dispatch?.(state.tr.replaceSelectionWith(node));
		return true;
	}
);

export const toggleMarkFixed = <T extends string>(key: string, mark: $MarkSchema<T>) =>
	$command(key, (ctx) => () => (state, dispatch, view) => {
		const { tr, selection } = state;
		if (selection.empty) {
			const marks = selection.$head.marks();
			if (marks.some((x) => x.type === mark.type(ctx))) {
				const content = selection.$head.node().textContent;
				const start = selection.$head.parentOffset;
				let spaceCount = 0;
				for (; spaceCount < start; ++spaceCount) {
					if (content[start - spaceCount - 1] !== ' ') {
						break;
					}
				}
				const node = selection.$head.nodeBefore;
				const remainingMarks = marks.filter((x) => x.type !== mark.type(ctx));
				if (spaceCount > 0 && node?.text) {
					const offset = node.text.length - spaceCount + 1;
					console.log(node, offset, selection.from, selection.to);
					const { from } = selection;

					dispatch?.(tr.removeMark(from - spaceCount, from, null).ensureMarks([]));
					return true;
				}

				console.log(selection, content, start, spaceCount);

				dispatch?.(tr.ensureMarks(remainingMarks));
				return true;
			}

			dispatch?.(tr.addStoredMark(mark.type(ctx).create()));
			return true;
		}
		const { from, to } = selection;

		const has = state.doc.rangeHasMark(from, to, mark.type(ctx));
		if (has) {
			dispatch?.(tr.removeMark(from, to, mark.type(ctx)));
			return true;
		}
		dispatch?.(tr.addMark(from, to, mark.type(ctx).create()));
		return true;
	});

export const demoteHeadingCommand = $command(
	'DemoteHeading',
	(ctx) => () => (state, dispatch, view) => {
		const { $from } = state.selection;
		const node = $from.node();
		console.log(node.type);
		if (!state.selection.empty) return false;

		let level;
		if (node.type === headingSchema.type(ctx)) {
			level = node.attrs.level + 1;
		} else if (node.type === paragraphSchema.type(ctx)) {
			const res = setBlockType(headingSchema.type(ctx), { level: 1 })(state, dispatch, view);
			console.log(res);

			return res;
		} else {
			return false;
		}

		if (level > 5) return setBlockType(paragraphSchema.type(ctx))(state, dispatch, view);

		dispatch?.(
			state.tr.setNodeMarkup(state.selection.$from.before(), undefined, {
				...node.attrs,
				level
			})
		);
		return true;
	}
);

export const toggleCodeCommand = $command('ToggleCode', (ctx) => () => (state, dispatch) => {
	const { selection, tr } = state;

	if (selection.empty) {
		const marks = selection.$head.marks();
		if (marks.some((x) => x.type === inlineCodeSchema.type(ctx))) {
			dispatch?.(tr.ensureMarks([]));
			return true;
		}
		dispatch?.(tr.setStoredMarks([]));
		dispatch?.(tr.addStoredMark(inlineCodeSchema.type(ctx).create()));
		return true;
	}
	const { from, to } = selection;

	const has = state.doc.rangeHasMark(from, to, inlineCodeSchema.type(ctx));
	// remove exists inlineCode mark if have
	if (has) {
		dispatch?.(tr.removeMark(from, to, inlineCodeSchema.type(ctx)));
		return true;
	}

	const restMarksName = Object.keys(state.schema.marks).filter(
		(x) => x !== inlineCodeSchema.type.name
	);

	// remove other marks
	restMarksName
		.map((name) => state.schema.marks[name] as MarkType)
		.forEach((t) => {
			tr.removeMark(from, to, t);
		});

	// add inlineCode mark
	dispatch?.(tr.addMark(from, to, inlineCodeSchema.type(ctx).create()));
	return true;
});

export const toggleBoldCommand = toggleMarkFixed('ToggleBold', strongSchema);
export const toggleItalicCommand = toggleMarkFixed('ToggleItalic', emphasisSchema);
