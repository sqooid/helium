import {
	headingSchema,
	inlineCodeSchema,
	paragraphSchema,
	strongSchema
} from '@milkdown/preset-commonmark';
import { setBlockType } from '@milkdown/prose/commands';
import { $command } from '@milkdown/utils';
import type { MarkType } from 'prosemirror-model';
import { blockSpoilerNode, blockSpoilerTitleNode, spanNode } from './spoiler-plugin';
import { StringSchema } from 'yup';

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

export const toggleBoldCommand = $command('ToggleBold', (ctx) => () => (state, dispatch, view) => {
	const { tr, selection } = state;
	if (selection.empty) {
		console.log(selection);
		const marks = selection.$head.marks();
		if (marks.some((x) => x.type.name === 'strong')) {
			dispatch?.(tr.ensureMarks(marks.filter((x) => x.type.name !== 'strong')));
			return true;
		}

		dispatch?.(tr.addStoredMark(strongSchema.type(ctx).create()));
		return true;
	}
	const { from, to } = selection;

	const has = state.doc.rangeHasMark(from, to, strongSchema.type(ctx));
	if (has) {
		dispatch?.(tr.removeMark(from, to, strongSchema.type(ctx)));
		return true;
	}
	dispatch?.(tr.addMark(from, to, strongSchema.type(ctx).create()));
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
