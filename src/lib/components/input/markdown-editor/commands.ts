import { headingSchema, inlineCodeSchema, paragraphSchema } from '@milkdown/preset-commonmark';
import { $command } from '@milkdown/utils';
import { setBlockType, toggleMark } from '@milkdown/prose/commands';
import type { MarkType } from 'prosemirror-model';

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
	const { $from } = state.selection;
	const node = $from.node();
	console.log(selection, node);

	if (selection.empty) {
		const marks = selection.$head.marks();
		if (marks.some((x) => x.type === inlineCodeSchema.type(ctx))) {
			dispatch?.(tr.ensureMarks([]));
		}
		console.log(marks);

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
