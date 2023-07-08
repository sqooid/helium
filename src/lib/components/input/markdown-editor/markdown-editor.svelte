<script lang="ts">
	import {
		Editor,
		rootCtx,
		defaultValueCtx,
		commandsCtx,
		remarkPluginsCtx,
		nodesCtx
	} from '@milkdown/core';
	import { nord } from '@milkdown/theme-nord';
	import { trailing } from '@milkdown/plugin-trailing';
	import { commonmark, headingAttr, blockquoteAttr } from '@milkdown/preset-commonmark';
	import MarkdownEditorToolbar from './markdown-editor-toolbar.svelte';
	import Modal from '../modal/modal.svelte';
	import {
		blockSpoilerInputRule,
		blockSpoilerNode,
		blockSpoilerTitleNode,
		remarkDirective,
		remarkSpacedDirective,
		spanNode
	} from './custom-plugin';

	export let value = '_stuff_ stuff\n:::spoiler title _title_\ncontent\n>quote\n\n:::\nbehind';

	let editorRef: Editor | null = null;
	const editor = (dom: HTMLElement) => {
		const MakeEditor = Editor.make()
			.config((ctx) => {
				ctx.set(rootCtx, dom);
				ctx.set(defaultValueCtx, value);
				ctx.set(headingAttr.key as any, (node: any) => {
					const level = node.attrs.level;
					if (level === 1) return { class: 'text-4xl', 'data-el-type': 'h1' };
					if (level === 2) return { class: 'text-3xl', 'data-el-type': 'h2' };
					if (level === 3) return { class: 'text-2xl', 'data-el-type': 'h3' };
					if (level === 4) return { class: 'text-xl', 'data-el-type': 'h4' };
					if (level === 5) return { class: 'text-lg', 'data-el-type': 'h5' };
				});
				ctx.set(blockquoteAttr.key as any, (node: any) => {
					return {
						class:
							'p-4 dark:bg-white dark:bg-opacity-10 dark:border-l-4 dark:border-white shadow-md rounded-md'
					};
				});
			})
			.config(nord)
			.use(commonmark)
			.use(trailing)
			.use([blockSpoilerNode, blockSpoilerTitleNode, blockSpoilerInputRule, spanNode])
			.use(remarkSpacedDirective)
			.create();
		MakeEditor.then((editor) => {
			editorRef = editor;
			const nodes = editor.ctx.get(nodesCtx);
			console.log('nodes', nodes);
		});
	};

	const onClickDoc = (e: MouseEvent) => {
		console.log(e.target);
	};
	const onKeyDownDoc = (e: KeyboardEvent) => {};
	const onMove = () => {
		if (!editorRef) return;
		editorRef.onStatusChange(console.log);
	};
</script>

<div class="w-full h-full flex flex-col">
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div use:editor class="flex-grow" on:click={onClickDoc} on:keydown={onKeyDownDoc} />
	<details>
		<summary>fum</summary>
		fuck
	</details>
	<MarkdownEditorToolbar class="justify-self-end" editor={editorRef} />
</div>

<style lang="postcss">
</style>