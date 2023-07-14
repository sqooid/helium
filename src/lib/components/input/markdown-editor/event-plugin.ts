import { editorViewCtx, type Config } from '@milkdown/core';
import { paragraphSchema } from '@milkdown/preset-commonmark';
import type { Node } from 'prosemirror-model';

export const eventListen =
	(callback: (node: Node) => void): Config =>
	(ctx) => {
		ctx.update(editorViewCtx, (view) => {
			const props = view.props;
			props.handleClickOn = (_0, _1, n) => {
				// if (n.type === paragraphSchema.type(ctx)) {
				callback(n);
				// }
			};
			view.setProps(props);
			return view;
		});
	};
