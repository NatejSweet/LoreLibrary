<script lang="ts">
    import NumberList from '$lib/components/textComponents/numberList.svelte';
    import {getClass, getStyle, loadFont} from "$lib/scripts/componentStyling";
    export let items: {text: string; depth: number }[] = [];
    export let style: Record<string, any> | undefined = undefined;

        $: if (style?.text?.["font variant"]) {
        loadFont(style.text["font variant"]);
    }

    let cAlignment ="";
    const tmp_align = style?.text?.align;
    if (style?.text?.align) {
        switch (style.text.align) {
            case "Left":
                cAlignment = `self-start `;
                break;
            case "Center":
                cAlignment = `self-center `;
                break;
            case "Right":
                cAlignment = `self-end `;
                break;
        }
        delete style.text.align; //temporarily remove align so it it not used in getClass and getStyle
    }
    const c = getClass(style);
    const s = getStyle(style);
    if (style && tmp_align) {
        style.text.align = tmp_align;//return align to preserve state, its either this or overgeneralizing getClass and getStyle
    }

    function getNumberPrefix(index: number): string {
        const locItems = items.map((item, i) => ({ ...item, id: crypto.randomUUID()})); // Assign temporary IDs for tracking
        const item = locItems[index];
        for (let i = index - 1; i >= 0; i--) {//for each previous item
            if (locItems[i].depth < item.depth) { // if the item is less deep than the current item
                //remove all items before
                locItems.splice(0, i + 1);
                break;
            }
        }
		if (!item) return "";
		const sameLevelItems = locItems.filter(i => i.depth === item.depth);
		const position = sameLevelItems.findIndex(i => i.id === item.id);
		return `${position + 1}.`;	
	}

    const getFontSize = () => {
        if (!style || !style.text || !style.text.size) return 'text-base';
        switch (style.text.size) {
            case 'Header 1':
                return 'text-5xl ml-8';
            case 'Header 2':
                return 'text-3xl  ml-5';
            case 'Header 3':
                return 'text-2xl  ml-3';
            case 'Header 4':
                return 'text-xl  ml-2';
            case 'Header 5':
                return 'text-lg ml-1';
            default:
                return 'text-base';
        }
    };
</script>
<div style={s} class={c + " flex flex-col"}>
    <div class={cAlignment + " w-fit"}>
        <ol class="pl-6 list-inside">
            {#each items as item, i }
                <li style="margin-left:{item.depth * 20}px" class={getFontSize() + ` ${style?.text?.font ? 'font-' + style.text.font : ''} flex items-center`}>
                    <span class="mr-2 select-none">
                    {getNumberPrefix(i)}
                    </span>  
                    {item.text}
                </li>
            {/each}
        </ol>
    </div>
</div>