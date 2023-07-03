<script lang="ts">
	import { Editor, rootCtx, defaultValueCtx, commandsCtx } from '@milkdown/core';
	import { nord } from '@milkdown/theme-nord';
	import { commonmark } from '@milkdown/preset-commonmark';
	import MarkdownEditorToolbar from './markdown-editor-toolbar.svelte';
	import Modal from '../modal/modal.svelte';

	export let value = 'Milk';

	let editorRef: Editor | null = null;
	const editor = (dom: HTMLElement) => {
		const MakeEditor = Editor.make()
			.config((ctx) => {
				ctx.set(rootCtx, dom);
				ctx.set(defaultValueCtx, value);
			})
			.config(nord)
			.use(commonmark)
			.create();
		MakeEditor.then((editor) => {
			editorRef = editor;
		});
	};
</script>

<div class="w-full h-full flex flex-col">
	<div use:editor class="flex-grow" />
	<MarkdownEditorToolbar class="justify-self-end" editor={editorRef} />
	<Modal show>
		<span>hello</span>
	</Modal>
</div>

<style lang="postcss">
</style>
