import type { Config } from '@milkdown/core';
import { prismConfig } from '@milkdown/plugin-prism';
import css from 'refractor/lang/css';
import javascript from 'refractor/lang/javascript';
import jsx from 'refractor/lang/jsx';
import markdown from 'refractor/lang/markdown';
import tsx from 'refractor/lang/tsx';
import typescript from 'refractor/lang/typescript';

export const synaxHighlight: Config = (ctx) => {
	ctx.set(prismConfig.key, {
		configureRefractor: (refractor) => {
			refractor.register(markdown);
			refractor.register(css);
			refractor.register(javascript);
			refractor.register(typescript);
			refractor.register(jsx);
			refractor.register(tsx);
		}
	});
};
