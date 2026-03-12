<script lang="ts">
    import { editComponentContents } from '$lib/state/editState.svelte';
	import ComponentControls from '../controls/componentControls.svelte';
    import MoveComponentButtons from '../controls/moveComponentButtons.svelte';
    export let items: { id: string; text: string; depth: number }[] = [];
    export let index: number;
	export let onDragStart: (index: number) => void = () => {};
    export let onDrop: (index: number) => void = () => {};
	import { tick } from 'svelte';
	import {getClass, getStyle} from "$lib/scripts/componentStyling";
	type ListItem = {
		id: string;
		text: string;
		depth: number;
	};

	let inputs: Record<string, HTMLInputElement> = {};

	function updateText(index: number, e: Event) {
		items[index].text = (e.target as HTMLInputElement).value;
		items = items;
	}

	async function addItem(index: number) {
		const newItem: ListItem = {
			id: crypto.randomUUID(),
			text: "",
			depth: items[index].depth
		};

		items.splice(index + 1, 0, newItem);
		items = items;

		await tick();
		inputs[newItem.id]?.focus();
	}

	function indentItem(index: number) {
		if (index === 0) return;
		items[index].depth = items[index].depth + 1
		items = items;
	}

	function outdentItem(index: number) {
		items[index].depth = Math.max(0, items[index].depth - 1);
		items = items;
	}

	function focusItem(index: number, cursor?: number) {
		const item = items[index];
		if (!item) return;

		const el = inputs[item.id];
		el?.focus();

		if (cursor !== undefined && el) {
			const pos = Math.min(cursor, el.value.length);
			el.setSelectionRange(pos, pos);
		}
	}

	function handleKey(e: KeyboardEvent, index: number) {
		const input = e.target as HTMLInputElement;
		const cursor = input.selectionStart ?? 0;
		switch (e.key) {
			case "Enter":
				e.preventDefault();
				addItem(index);
				break;
			case "Tab":
				e.preventDefault();
				e.shiftKey ? outdentItem(index) : indentItem(index);
				break;
			case "Backspace":
				if (cursor === 0) {
					e.preventDefault();
					if (items[index].text === "") {
						items.splice(index, 1);
						items = items;
						focusItem(index - 1);
					} else {
						outdentItem(index);
						focusItem(index, cursor);
					}
				}
			break;
			case "ArrowUp":
				e.preventDefault();
				focusItem(index - 1, cursor);
				break;
			case "ArrowDown":
				e.preventDefault();
				focusItem(index + 1, cursor);
				break;
		}
	}

    function getNumberPrefix(index: number): string {
        const locItems = items.map((item, i) => ({ ...item, id: crypto.randomUUID()}));// Assign temporary IDs for tracking
        const item = locItems[index];
        for (let i = index - 1; i >= 0; i--) {//for each previous item
			console.log(i);
			console.log(locItems);
            console.log(locItems[i]);
			
            if (locItems[i].depth < item.depth) { // if the item is less deep than the current item
                //remove all items before
                locItems.splice(0, i + 1);
				console.log("removing", i);
                break;
            }
        }
		if (!item) return "";
		const sameLevelItems = locItems.filter(i => i.depth === item.depth);
		console.log("same level items", sameLevelItems);
		const position = sameLevelItems.findIndex(i => i.id === item.id);
		return `${position + 1}.`;	
	}

	$: styling = $editComponentContents[index]?.style ?? {border: {color: ["surface", true, "500"], padding: "2px", margin: "2px", rounding: "Slight"}, text: {align: "left"}};
    $: c = getClass(styling);
    $: s = getStyle(styling);
	$: ml = styling.text.size === 'Header 1' ? 'pl-8' : styling.text.size === 'Header 2' ? 'pl-5' : styling.text.size === 'Header 3' ? 'pl-3' : styling.text.size === 'Header 4' ? 'pl-2' : styling.text.size === 'Header 5' ? 'pl-1' : '';
</script>

<div
    role="listitem"
    class="flex flex-row w-full items-center justify-center h-full"
    on:dragover|preventDefault
    on:drop={() => onDrop(index)}
    >
    <MoveComponentButtons index={index} onDragStart={onDragStart}/>
    <div class={c + (styling.border?.padding == null ? ' p-2 ' : ' ') + ml + ' flex-1 items-stretch grid gap-1 grid-cols-[1fr_auto] focus-within:ring-4 focus-within:ring-offset-2 focus-within:ring-secondary-500'}>
		<div>
			<ol class="list-decimal pl-[2.5%] border-l border-muted ">
				{#each items as item, i (item.id)}
				<li class="flex items-center" style="margin-left:{item.depth * 20}px; max-width: calc(100% - {item.depth * 20}px)}">
					<span class="mr-2 select-none">
						{getNumberPrefix(i)}
					</span>
						<input
							bind:this={inputs[item.id]}
							value={item.text}
							on:input={(e) => updateText(i, e)}
							on:keydown={(e) => handleKey(e, i)}
							size={Math.max(1, item.text.length)}
							class="w-full max-w-full"
						/>
				</li>
				{/each}
			</ol>
        </div>
		<ComponentControls index={index} type="nl" />
	</div>
</div>
