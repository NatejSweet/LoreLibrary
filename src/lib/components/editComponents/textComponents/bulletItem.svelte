<script lang="ts">
    import BulletItem from './bulletItem.svelte';

    export let item: { id: string; text: string; subItems?: any[] };
    export let addSubBullet: (parent: any) => void;
    export let removeSubBullet: (parent: any, subId: string) => void;
    export let removeItem: (item: { id: string }) => void;
    export let updateItem: (updatedItem: { id: string; text: string; subItems?: any[] }) => void;

    const handleRemoveItem = () => {
        removeItem(item);
    };

    const handleInput = (e: Event) => {
        const newText = (e.target as HTMLInputElement).value;
        updateItem({ ...item, text: newText });
    };
</script>

<li class="my-4 gap-2 text-surface">
    <div class="flex items-center gap-2">
        <input
            type="text"
            value={item.text}
            on:input={handleInput}
            class="input input-ghost w-full text-surface bg-surface border-primary-200 border-2 max-w-[15%]"
            placeholder="Enter text"
        />
        <button on:click={() => addSubBullet(item)} class="btn btn-primary preset-tonal-primary">
            Add Sub-Bullet
        </button>
        <button on:click={handleRemoveItem} class="btn btn-error preset-tonal-error">
            Remove
        </button>
    </div>

    {#if item.subItems?.length}
        <ul class="list-disc pl-6 border-l border-muted ml-2">
            {#each item.subItems as subBullet (subBullet.id)}
                <BulletItem
                    item={subBullet}
                    {addSubBullet}
                    {removeSubBullet}
                    removeItem={() => removeSubBullet(item, subBullet.id)}
                    updateItem={(updatedSub) => {
                        subBullet.text = updatedSub.text;
                        updateItem({ ...item, subItems: [...(item.subItems || [])] });
                    }}
                />
            {/each}
        </ul>
    {/if}
</li>