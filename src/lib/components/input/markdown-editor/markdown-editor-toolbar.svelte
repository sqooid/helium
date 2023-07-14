<script lang="ts">
	import { uploadImage } from '$lib/client/content';
	import BoldIcon from '$lib/components/icons/bold-icon.svelte';
	import CodeIcon from '$lib/components/icons/code-icon.svelte';
	import EyeSlashIcon from '$lib/components/icons/eye-slash-icon.svelte';
	import HeadingIcon from '$lib/components/icons/heading-icon.svelte';
	import ImageIcon from '$lib/components/icons/image-icon.svelte';
	import ItalicIcon from '$lib/components/icons/italic-icon.svelte';
	import QuoteRightIcon from '$lib/components/icons/quote-right-icon.svelte';
	import TerminalIcon from '$lib/components/icons/terminal-icon.svelte';
	import { getFileInput } from '$lib/helpers/dom';
	import { editorStateCtx, type Editor } from '@milkdown/core';
	import {
		createCodeBlockCommand,
		insertImageCommand,
		toggleEmphasisCommand,
		toggleStrongCommand,
		wrapInBlockquoteCommand
	} from '@milkdown/preset-commonmark';
	import { callCommand } from '@milkdown/utils';
	import { debounce } from 'lodash-es';
	import type { Node } from 'prosemirror-model';
	import { createSpoilerCommand, demoteHeadingCommand, toggleCodeCommand } from './commands';
	import { eventListen } from './event-plugin';
	import MarkdownEditorToolbarButton from './markdown-editor-toolbar-button.svelte';

	export let editor: Editor | null;
	export const keypressNotify = (e: KeyboardEvent) => {
		updateModifiers();
	};

	const buttonWrapper = (fn: (e: MouseEvent) => void) => (e: MouseEvent) => {
		fn(e);
		updateModifiers();
	};

	const toggleBold = () => editor?.action(callCommand(toggleStrongCommand.key));
	const toggleItalic = () => editor?.action(callCommand(toggleEmphasisCommand.key));
	const toggleInlineCode = () => editor?.action(callCommand(toggleCodeCommand.key));
	const createCodeBlock = () => editor?.action(callCommand(createCodeBlockCommand.key));
	const uploadImages = () => {
		getFileInput(
			async (files) => {
				if (!files) return;
				for (const file of files) {
					const { url, deleteUrl } = await uploadImage(file);
					if (url) insertImage({ src: url });
				}
			},
			{ fileTypes: ['.png', '.jpg', '.jpeg', '.webp'] }
		);
	};
	const insertImage = (payload: { src: string; alt?: string; title?: string }) =>
		editor?.action(callCommand(insertImageCommand.key, payload));
	const demoteHeading = () => editor?.action(callCommand(demoteHeadingCommand.key));
	const toggleQuote = () => editor?.action(callCommand(wrapInBlockquoteCommand.key));
	const createSpoiler = () => editor?.action(callCommand(createSpoilerCommand.key));

	const defaultModifiers = {
		strong: false,
		emphasis: false,
		heading: false,
		blockquote: false,
		inlineCode: false,
		code_block: false,
		spoiler: false
	};
	let activeModifiers = { ...defaultModifiers };

	const updateModifiers = debounce(() => {
		activeModifiers = { ...defaultModifiers };
		editor?.action((ctx) => {
			const state = ctx.get(editorStateCtx);
			let position = state.selection.$head;
			let node = position.node();
			const marks = position.marks();

			// Update blocks
			let depth = 0;
			while (node) {
				(activeModifiers as any)[node.type.name] = true;
				++depth;
				node = position.node(depth);
			}

			// Update marks
			marks.forEach((x) => {
				(activeModifiers as any)[x.type.name] = true;
			});
		});
	}, 5);
	const handleClickMove = (node: Node) => {
		updateModifiers();
	};
	$: if (editor) {
		editor.action(eventListen(handleClickMove));
	}
</script>

<div
	class={`${$$props.class} dark:bg-dark4 flex shadow-lg rounded-md overflow-hidden border dark:border-darkElev8`}
>
	<MarkdownEditorToolbarButton
		icon={BoldIcon}
		active={activeModifiers.strong}
		on:mousedown={buttonWrapper(toggleBold)}
	/>
	<MarkdownEditorToolbarButton
		icon={ItalicIcon}
		active={activeModifiers.emphasis}
		on:mousedown={buttonWrapper(toggleItalic)}
	/>
	<MarkdownEditorToolbarButton
		icon={HeadingIcon}
		active={activeModifiers.heading}
		on:mousedown={buttonWrapper(demoteHeading)}
	/>
	<MarkdownEditorToolbarButton
		icon={QuoteRightIcon}
		active={activeModifiers.blockquote}
		on:mousedown={buttonWrapper(toggleQuote)}
	/>
	<MarkdownEditorToolbarButton
		icon={TerminalIcon}
		active={activeModifiers.inlineCode}
		on:mousedown={buttonWrapper(toggleInlineCode)}
	/>
	<MarkdownEditorToolbarButton
		icon={CodeIcon}
		active={activeModifiers.code_block}
		on:mousedown={buttonWrapper(createCodeBlock)}
	/>
	<MarkdownEditorToolbarButton
		icon={EyeSlashIcon}
		active={activeModifiers.spoiler}
		on:mousedown={buttonWrapper(createSpoiler)}
	/>
	<MarkdownEditorToolbarButton icon={ImageIcon} on:mousedown={uploadImages} />
</div>

<style lang="postcss">
</style>
