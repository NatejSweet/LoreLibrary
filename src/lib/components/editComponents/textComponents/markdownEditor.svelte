<script lang="ts">
    export let content: string;
    export let index: number;
    export let onDragStart: (index: number) => void = () => {};
    export let onDrop: (index: number) => void = () => {};
    import MoveComponentButtons from '../controls/moveComponentButtons.svelte';
    import { editComponentContents } from '$lib/state/editState.svelte';
    import ComponentControls from '../controls/componentControls.svelte';
    import {getClass, getStyle} from "$lib/scripts/componentStyling";
    import {tick} from "svelte";


    function syncToStore() {
        editComponentContents.update((contents) => {
            const next = [...contents];
            const existing = next[index] ?? {};
            next[index] = { ...existing, md: content };
            return next;
        });
    }

        
    let styling: Record<string, any> = {};
    let c = "";
    let s = "";

    $: styling = $editComponentContents[index]?.style ?? {border: {color: ["surface", true, "500"], padding: "2px", margin: "2px", rounding: "Slight"}, text: {align: "left"}};
    $: c = getClass(styling);
    $: s = getStyle(styling);

    $: if (styling) {
        tick().then(autoResize);
    }

    let textareaEl: HTMLTextAreaElement;
    function autoResize() {
        if (!textareaEl) return;
        textareaEl.style.height = "auto";
        textareaEl.style.height = textareaEl.scrollHeight + "px";
    }

</script>
<div
    role="listitem"
    class="flex flex-row w-full items-center justify-center h-full"
    on:dragover|preventDefault
    on:drop={() => onDrop(index)}
    >
    <MoveComponentButtons index={index} onDragStart={onDragStart}/>
        <div
            class={c + (styling.border?.padding == null ? ' p-2' : '') + ' flex-1 items-stretch grid grid-cols-[1fr_auto] focus-within:ring-4 focus-within:ring-offset-2 focus-within:ring-secondary-500'}
            style={s}>
            <textarea
            bind:this={textareaEl}
            bind:value={content}
            on:input={() => syncToStore() }
            placeholder="Enter your text here..."
            class="bg-transparent text-surface pr-3 w-full h-full resize-none
            border-0 outline-none ring-0 focus:outline-none focus:ring-0 align-top"
            style={"text-align: " + (styling?.text?.align || 'left') + ";"}
        ></textarea>
        <ComponentControls index={index} type="md" />
    </div>
</div>