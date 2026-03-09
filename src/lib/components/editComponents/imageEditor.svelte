<script lang="ts">
    export let content: string;
    export let index: number;
    export let onDragStart: (index: number) => void = () => {};
    export let onDrop: (index: number) => void = () => {};
    import { editComponentContents } from '$lib/state/editState.svelte';
    import {getClass, getStyle} from "$lib/scripts/componentStyling";
    import ComponentControls from './controls/componentControls.svelte';
    import MoveComponentButtons from './controls/moveComponentButtons.svelte';

    function syncToStore() {
        editComponentContents.update((contents) => {
            const next = [...contents];
            const existing = next[index] ?? {};
            next[index] = { ...existing, image_url: content };
            return next;
        });
    }

    let styling: Record<string, any> = {};
    let c = "";
    let s = "";

    $: styling = $editComponentContents[index]?.style ?? {border: {color: ["surface", true, "500"], padding: "2px", margin: "2px", rounding: "Slight"}, text: {align: "left"}};
    $: c = getClass(styling);
    $: c = c.replace("float-left", "mr-auto");
    $: c = c.replace("float-right", "ml-auto");
    $: c = c.replace("block mx-auto", "mx-auto");
    $: s = getStyle(styling);


</script>
<div class="flex flex-col w-full h-full">
    <div
        role="listitem"
        class="flex flex-row w-full items-center justify-center h-full"
        on:dragover|preventDefault
        on:drop={() => onDrop(index)}
        >
        <MoveComponentButtons index={index} onDragStart={onDragStart}/>
        <div class="rounded grid grid-cols-[1fr_auto] items-stretch border-2 p-2 border-primary-200 bg-surface-500 focus-within:ring-2 focus-within:ring-blue-500 w-[97%]">
            <textarea
                bind:value={content}
                on:input={() => syncToStore()}
                placeholder="Enter the url to your image here..."
                
                class="bg-transparent text-surface pr-3 w-full h-full resize-none
                    border-0 outline-none ring-0 focus:outline-none focus:ring-0 align-top"
            ></textarea>
            <ComponentControls index={index} type="img" />
        </div>
    </div>
    <div class="flex">
    <img src={content} alt="Image preview"  class={c} style={s}/>
    </div>
</div>