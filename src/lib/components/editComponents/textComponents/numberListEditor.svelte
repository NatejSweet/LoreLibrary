<script lang="ts">
    import NumberItem from './numberItem.svelte';
    import { editComponentContents } from '$lib/state/editState.svelte';

    export let items: { id: string; text: string; subItems?: any[] }[] = [];
    export let index: number;
     function syncToStore() {
		editComponentContents.update((contents) => {
			contents[index] = {key: "numberedList", value: items};
			return contents;
		});
		console.log(items);
	}

	const addItem = () => {
		items = [...items, { id: crypto.randomUUID(), text: '', subItems: [] }];
		syncToStore();
	};

	const removeItem = (item: { id: string }) => {
		items = items.filter((number) => number.id !== item.id);
		syncToStore();
	};

	function addSubItem(parent: { subItems?: any[] }) {
		parent.subItems = parent.subItems || [];
		parent.subItems.push({ id: crypto.randomUUID(), text: '', subItems: [] });
		items = [...items];
		syncToStore();
	}

	function removeSubItem(parent: { subItems?: any[] }, subId: string) {
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
</script>
<div class="border-2 border-primary-200 bg-surface-500 rounded-lg">
<ol class="list-decimal pl-[2.5%] border-l border-muted ">
    {#each items as number, i (number.id)}
        <NumberItem
            item={number}
            {addSubItem}
            {removeSubItem}
            removeItem={removeItem}
            updateItem={(updatedItem) => updateItem(i, updatedItem)}
        />
    {/each}
</ol>

<button on:click={addItem} class="btn preset-tonal-primary button-filled max-w-40 ml-4 my-2">Add Item</button>
</div>
