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

	const addItem = () => {
		items = [...items, { id: crypto.randomUUID(), text: '', subItems: [] }];
		syncToStore();
	};

	const removeItem = (item: { id: string }) => {
		items = items.filter((bullet) => bullet.id !== item.id);
		syncToStore();
	};

	function addSubBullet(parent: { subItems?: any[] }) {
		parent.subItems = parent.subItems || [];
		parent.subItems.push({ id: crypto.randomUUID(), text: '', subItems: [] });
		items = [...items];
		syncToStore();
	}

	function removeSubBullet(parent: { subItems?: any[] }, subId: string) {
		if (parent.subItems) {
			parent.subItems = parent.subItems.filter((b) => b.id !== subId);
			items = [...items];
			syncToStore();
		}
	}

	const updateItem = (idx: number, updatedItem: { id: string; text: string; subItems?: any[] }) => {
		items[idx] = updatedItem;
		items = [...items];
		syncToStore();
	};

	
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
			<ul class='list-disc pl-[2.5%]' style={"font-size: 0;"}>
				{#each items as bullet, i (bullet.id)}<BulletItem
					item={bullet}
					{addSubBullet}
					{removeSubBullet}
					removeItem={removeItem}
					updateItem={(updatedItem) => updateItem(i, updatedItem)}
				/>
				{/each}
			</ul>
		<button on:click={addItem} class="btn preset-tonal-primary button-filled max-w-40 ml-4 my-2">Add Item</button>
        		</div>
		<ComponentControls index={index} type="bl" />
    </div>
</div>