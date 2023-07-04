<script lang="ts">
	import type { Editor } from '@milkdown/core';
	import {
		createCodeBlockCommand,
		insertImageCommand,
		toggleEmphasisCommand,
		toggleInlineCodeCommand,
		toggleStrongCommand
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
	export let editor: Editor | null;

	const toggleBold = () => editor?.action(callCommand(toggleStrongCommand.key));
	const toggleItalic = () => editor?.action(callCommand(toggleEmphasisCommand.key));
	const toggleInlineCode = () => editor?.action(callCommand(toggleInlineCodeCommand.key));
	const createCodeBlock = () => editor?.action(callCommand(createCodeBlockCommand.key));
	const insertImages = () => {
		getFileInput(
			(files) => {
				console.log(files);

				if (!files) return;
				for (const file of files) {
					uploadImage(file);
				}
			},
			{ fileTypes: ['.png', '.jpg', '.jpeg', '.webp'] }
		);
	};
	const insertImage = () => editor?.action(callCommand(insertImageCommand.key));
</script>

<div class={`${$$props.class} dark:bg-dark4 flex shadow-md`}>
	<MarkdownEditorToolbarButton icon={BoldIcon} active on:mousedown={toggleBold} />
	<MarkdownEditorToolbarButton icon={ItalicIcon} on:mousedown={toggleItalic} />
	<MarkdownEditorToolbarButton icon={TerminalIcon} on:mousedown={toggleInlineCode} />
	<MarkdownEditorToolbarButton icon={CodeIcon} on:mousedown={createCodeBlock} />
	<MarkdownEditorToolbarButton icon={ImageIcon} on:mousedown={insertImages} />
</div>

<style lang="postcss">
</style>
