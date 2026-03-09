<script lang="ts">
	import BulletItem from './bulletItem.svelte';
    export let item: { id: string; text: string; subItems?: any[] };
    export let index: number;
    export let updateItem: (updatedItem: { id: string; text: string; subItems?: any[] }) => void;
    export let addNewBullet: (parentId: string, index: number) => void;

    function handleInput(e: Event){
        //regular text input, just update the bullet text
        item.text = (e.target as HTMLInputElement).value;
        updateItem(item);  
    }

    function handleKeyPress(e: KeyboardEvent) {
        console.log("key press", e.key);
        if (e instanceof KeyboardEvent){
            switch (e.key) {
                case "Enter":
                    e.preventDefault();
                    addNewBullet(item.id, index);
                    break;
                case "Tab":
                    e.preventDefault();
                    if (e.shiftKey) {
                        //outdent bullet
                        //this is a bit tricky, we need to find the parent bullet and move this bullet to its level
                        //we can pass down a function from the parent editor component that handles this logic, but for now we'll just log it
                        console.log("Outdent bullet");
                    } else {
                        //indent bullet
                        //this is also tricky, we need to find the previous sibling bullet and make this bullet a child of it
                        //again, we can pass down a function from the parent editor component that handles this logic, but for now we'll just log it
                        console.log("Indent bullet");
                    }
                    break;
            }
        }
    } 


</script>

<li class="my-2 text-surface">
	<input class="text h-auto w-auto text-white bg-transparent focus:outline-none focus:ring-0 p-0 m-0" data-id={item.id} value={item.text}
	placeholder="Enter bullet text..."
	on:input={handleInput}
    on:keypress={handleKeyPress}
/>

	{#if item.subItems?.length}
		<ul class="list-disc pl-6 ml-2">
			{#each item.subItems as subBullet, i (subBullet.id)}
				<BulletItem
					item={subBullet}
					index={i}
                    addNewBullet={addNewBullet}
                    updateItem={updateItem}
				/>
			{/each}
		</ul>
	{/if}
</li>