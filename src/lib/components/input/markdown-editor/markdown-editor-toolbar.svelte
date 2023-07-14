<script lang="ts">
	import { editorStateCtx, type Editor } from '@milkdown/core';
	import {
		createCodeBlockCommand,
		insertImageCommand,
		toggleEmphasisCommand,
		toggleInlineCodeCommand,
		toggleStrongCommand,
		downgradeHeadingCommand,
		wrapInBlockquoteCommand
	} from '@milkdown/preset-commonmark';
	import { callCommand } from '@milkdown/utils';
	import MarkdownEditorToolbarButton from './markdown-editor-toolbar-button.svelte';
	import BoldIcon from '$lib/components/icons/bold-icon.svelte';
	import ItalicIcon from '$lib/components/icons/italic-icon.svelte';
	import CodeIcon from '$lib/components/icons/code-icon.svelte';
	import TerminalIcon from '$lib/components/icons/terminal-icon.svelte';
	import ImageIcon from '$lib/components/icons/image-icon.svelte';
	import { getFileInput } from '$lib/helpers/dom';
	import { uploadImage } from '$lib/client/content';
	import { eventListen } from './event-plugin';
	import type { Node } from 'prosemirror-model';
	import HeadingIcon from '$lib/components/icons/heading-icon.svelte';
	import QuoteRightIcon from '$lib/components/icons/quote-right-icon.svelte';
	import { demoteHeadingCommand, toggleCodeCommand } from './commands';
	import EyeSlashIcon from '$lib/components/icons/eye-slash-icon.svelte';
	import { debounce } from 'lodash-es';

	export let editor: Editor | null;
	export const keypressNotify = (e: KeyboardEvent) => {
		if (e.key.startsWith('Arrow')) {
			updateModifiers();
		}
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
				console.log(node);
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
		on:mousedown={toggleBold}
	/>
	<MarkdownEditorToolbarButton
		icon={ItalicIcon}
		active={activeModifiers.emphasis}
		on:mousedown={toggleItalic}
	/>
	<MarkdownEditorToolbarButton
		icon={HeadingIcon}
		active={activeModifiers.heading}
		on:mousedown={demoteHeading}
	/>
	<MarkdownEditorToolbarButton
		icon={QuoteRightIcon}
		active={activeModifiers.blockquote}
		on:mousedown={toggleQuote}
	/>
	<MarkdownEditorToolbarButton
		icon={TerminalIcon}
		active={activeModifiers.inlineCode}
		on:mousedown={toggleInlineCode}
	/>
	<MarkdownEditorToolbarButton
		icon={CodeIcon}
		active={activeModifiers.code_block}
		on:mousedown={createCodeBlock}
	/>
	<MarkdownEditorToolbarButton
		icon={EyeSlashIcon}
		active={activeModifiers.spoiler}
		on:mousedown={uploadImages}
	/>
	<MarkdownEditorToolbarButton icon={ImageIcon} on:mousedown={uploadImages} />
</div>

<style lang="postcss">
</style>
