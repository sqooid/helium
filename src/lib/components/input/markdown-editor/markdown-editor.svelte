<script lang="ts">
	import {
		Editor,
		rootCtx,
		defaultValueCtx,
		commandsCtx,
		remarkPluginsCtx,
		nodesCtx,
		editorViewCtx,
		serializerCtx,
		remarkStringifyOptionsCtx,
		schemaCtx,
		editorViewOptionsCtx
	} from '@milkdown/core';
	import { nord } from '@milkdown/theme-nord';
	import { trailing } from '@milkdown/plugin-trailing';
	import {
		commonmark,
		headingAttr,
		blockquoteAttr,
		imageAttr,
		inlineCodeAttr,
		codeBlockAttr
	} from '@milkdown/preset-commonmark';
	import MarkdownEditorToolbar from './markdown-editor-toolbar.svelte';
	import Modal from '../modal/modal.svelte';
	import {
		blockSpoilerInputRule,
		blockSpoilerNode,
		blockSpoilerTitleNode,
		remarkSpacedDirective,
		spanNode
	} from './spoiler-plugin';
	import { spacedDirectiveHandlers, spacedDirectiveSerializer } from './spaced-directives';
	import { editorStyle, theme } from './style-plugin';
	import { eventListen } from './event-plugin';
	import { synaxHighlight } from './syntax-plugin';
	import { prism } from '@milkdown/plugin-prism';
	import './syntax.css';
	// import './style.css';
	import '@milkdown/theme-nord/style.css';
	import {
		createSpoilerCommand,
		demoteHeadingCommand,
		toggleBoldCommand,
		toggleCodeCommand
	} from './commands';

	export let value = `

some _words_
::: spoiler don't look
secret stuff
eat shit
>blyat

dfd
:::
some more words
::: spoiler more spoilers
![](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbx13bqhb15FizG1wUVP4R9yj8GxyunNH90WbxaHniKA&s)
booooo
>blyat
:::spoiler BOO
haha
:::

nigs
:::
after
>quote

::: spoiler another one
\`code\`
:::

\`\`\`ts
const gay = "homo"
\`\`\`

	`;

	let editorRef: Editor | null = null;
	const editor = (dom: HTMLElement) => {
		const MakeEditor = Editor.make()
			.config((ctx) => {
				ctx.set(rootCtx, dom);
				ctx.set(defaultValueCtx, value);
			})
			.config(theme)
			.use(commonmark)
			.config(editorStyle)
			.config(synaxHighlight)
			.use(prism)
			.use(trailing)
			.use([demoteHeadingCommand, toggleCodeCommand, createSpoilerCommand, toggleBoldCommand])
			.use([blockSpoilerNode, blockSpoilerTitleNode, blockSpoilerInputRule, spanNode])
			.use(remarkSpacedDirective)
			.config(spacedDirectiveSerializer)
			.create();
		MakeEditor.then((editor) => {
			editorRef = editor;
			editor.action((ctx) => {
				ctx.update(schemaCtx, (schema) => {
					schema.marks.inlineCode.spec.inclusive = true;
					// schema.nodes.paragraph.spec.marks = '_';
					return schema;
				});
			});
			editor.action((ctx) => {
				const editorView = ctx.get(editorViewCtx);
				const serializer = ctx.get(serializerCtx);
				const md = serializer(editorView.state.doc);
				// console.log(md);
			});
		});
	};

	const onKeyDownDoc = (e: KeyboardEvent) => {
		toolbarRef.keypressNotify(e);
	};
	const onMove = () => {
		if (!editorRef) return;
		editorRef.onStatusChange(console.log);
	};
	let toolbarRef: MarkdownEditorToolbar;
</script>

<div class="w-full h-full flex flex-col relative items-center">
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		use:editor
		class="flex-grow w-full overflow-auto pb-64 max-w-prose"
		on:keydown={onKeyDownDoc}
	/>
	<div class="absolute bottom-8 flex items-center justify-center w-fit">
		<MarkdownEditorToolbar bind:this={toolbarRef} editor={editorRef} />
	</div>
</div>

<style lang="postcss">
	:global(.editor) {
		@apply flex flex-col gap-2;
	}
	:global(br[data-is-inline='true'], br[data-is-inline='true']::after) {
		content: ' ';
	}
	:global(
			:where(blockquote p:first-of-type):not(:where([class~='not-prose'] *))::before,
			:where(blockquote p:first-of-type):not(:where([class~='not-prose'] *))::after
		) {
		content: '';
	}

	:global(
			:where(code):not(:where([class~='not-prose'] *))::before,
			:where(code):not(:where([class~='not-prose'] *))::after
		) {
		content: '';
	}
</style>
