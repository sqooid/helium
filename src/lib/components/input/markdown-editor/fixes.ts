import { editorViewCtx, schemaCtx } from '@milkdown/core';
import type { Ctx } from '@milkdown/ctx';
import { emphasisSchema, strongSchema } from '@milkdown/preset-commonmark';
import { superscriptMark, subscriptMark, strikethroughMark } from './supsub-plugin';

export const fixSpaceBeforeMark = (ctx: Ctx) => {
	const bannedSpaceMarks = [
		strongSchema,
		emphasisSchema,
		superscriptMark,
		subscriptMark,
		strikethroughMark
	].map((x) => x.type(ctx));
	ctx.update(editorViewCtx, (view) => {
		const props = view.props;
		props.handleTextInput = (view, _from, _to, text) => {
			if (text !== ' ') return false;

			const carriedMarks =
				view.state.storedMarks?.filter((x) => bannedSpaceMarks.includes(x.type)) ?? [];
			if (carriedMarks.length === 0) return false;

			const pos = view.state.selection.head;
			const transaction = view.state.tr.insertText(' ');
			carriedMarks.forEach((x) => transaction.removeMark(pos, pos + 1, x).addStoredMark(x));
			view.dispatch(transaction);
			return true;
		};
		view.setProps(props);
		return view;
	});
};

export const fixInlineCodeInclusive = (ctx: Ctx) => {
	ctx.update(schemaCtx, (schema) => {
		schema.marks.inlineCode.spec.inclusive = true;
		return schema;
	});
};
