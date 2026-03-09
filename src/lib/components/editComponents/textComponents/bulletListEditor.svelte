<script lang="ts">
    import BulletItem from './bulletItem.svelte';
    import { editComponentContents } from '$lib/state/editState.svelte';
	import ComponentControls from '../controls/componentControls.svelte';
    import MoveComponentButtons from '../controls/moveComponentButtons.svelte';
	import {getClass, getStyle} from "$lib/scripts/componentStyling";

    export let items: { id: string; text: string; subItems?: any[] }[] = [];
    export let index: number;
	export let onDragStart: (index: number) => void = () => {};
    export let onDrop: (index: number) => void = () => {};
	
     function syncToStore() {
		editComponentContents.update((contents) => {
			const next = [...contents];
			const existing = next[index] ?? {};
			next[index] = { ...existing, bulletList: items };
			return next;
		});
	}

	function findItemById(items: any[], id: string): any | null {
		for (const item of items) {
			if (item.id === id) {
				return item;
			}
			if (item.subItems) {
				const found = findItemById(item.subItems, id);
				if (found) {
					return found;
				}
			}
		}
		return null;
	}

	function addNewBullet(parentId: string, index: number) {//if the current item has sub items, steal them for the new item
		const newBullet = { id: crypto.randomUUID(), text: "", subItems: [] };
		const parentItem = findItemById(items, parentId);
		if (parentItem) {
			if (parentItem.subItems.length === 0) {
				parentItem.subItems.push(newBullet);
			} else {
				console.log("adding new bullet to parent", parentItem);
				let subItems = parentItem.subItems;//copy sub items
				newBullet.subItems = parentItem.subItems[index]?.subItems || []; //grap predecessors sub items
				parentItem.subItems[index].subItems = [];//empty predecessors sub items
				subItems.splice(index + 1, 0, newBullet);//add new bullet as a sibling right after the current item
				parentItem.subItems = subItems;//update parent item sub items
			}
			syncToStore();	
		}
		setTimeout(() => {//focus on new item
                            const nextInput = document.querySelector(`input[data-id="${newBullet.id}"]`) as HTMLInputElement;
                            if (nextInput) {
                                nextInput.focus();
                            }
        }, 0);
	}
	function changeToSubBullet(index: number) {
		if (index === 0) return;//can't indent if there is no previous sibling
		const previousSibling = items[index - 1];
		const currentItem = items[index];
		if (!previousSibling.subItems) {
			previousSibling.subItems = [];
		}
		previousSibling.subItems.push(currentItem);
		items.splice(index, 1);
		syncToStore();
	}

	function updateItem(updatedItem: { id: string; text: string; subItems?: any[] }) {
		const item = findItemById(items, updatedItem.id);
		if (item) {
			item.text = updatedItem.text;
			item.subItems = updatedItem.subItems;
			syncToStore();	
		}
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
     <div
    class={c + (styling.border?.padding == null ? ' p-2 ' : ' ') + ml + ' flex-1 items-stretch grid gap-1 grid-cols-[1fr_auto] focus-within:ring-4 focus-within:ring-offset-2 focus-within:ring-secondary-500'}
    style={s}
  >
		<div>
			<ul class="list-disc pl-[2.5%]">
				{#each items as bullet, i (bullet.id)}
				{console.log("rendering bullet", bullet)}
					<BulletItem
						item={bullet}
						index={i}
						updateItem={updateItem}
						addNewBullet={addNewBullet}
					/>
				{/each}
			</ul> 
		</div>
		<ComponentControls index={index} type="bl" />
    </div>
</div>