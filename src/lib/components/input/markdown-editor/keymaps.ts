import { $useKeymap } from '@milkdown/utils';
import { toggleBoldCommand, toggleItalicCommand } from './commands';
import { commandsCtx, type Config } from '@milkdown/core';
import { emphasisKeymap, strongKeymap } from '@milkdown/preset-commonmark';
import { removeSpoilerCommand } from './spoiler-plugin';

export const customKeymap = $useKeymap('KeymapOverrides', {
	toggleBold: {
		shortcuts: 'Mod-b',
		command: (ctx) => {
			const commands = ctx.get(commandsCtx);
			return () => commands.call(toggleBoldCommand.key);
		}
	},
	toggleItalic: {
		shortcuts: 'Mod-i',
		command: (ctx) => {
			const commands = ctx.get(commandsCtx);
			return () => commands.call(toggleItalicCommand.key);
		}
	},
	deleteSpoiler: {
		shortcuts: ['Backspace'],
		command: (ctx) => {
			const commands = ctx.get(commandsCtx);
			return () => commands.call(removeSpoilerCommand.key);
		}
	}
});

export const removeDefaultKeymaps: Config = (ctx) => {
	ctx.set(strongKeymap.key, {
		ToggleBold: []
	});
	ctx.set(emphasisKeymap.key, {
		ToggleEmphasis: []
	});
};
