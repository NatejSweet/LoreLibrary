<script lang="ts">
    import { editComponentContents } from '$lib/state/editState.svelte';
    export let index: number | undefined;
    export let menuPosition = { x: 0, y: 0 };
    export let closeMenu: () => void;

    const menuOptions = {
        'Text': ['Header', 'Paragraph', 'Markdown', 'HTML', 'Number List', 'Bullet List'],
        'TBA': ["Option 2.1", "Option 2.2", "Option 2.3"],
    };

    let selectedCategory: keyof typeof menuOptions = Object.keys(menuOptions)[0] as keyof typeof menuOptions;

    function selectCategory(category: keyof typeof menuOptions) {
        selectedCategory = category;
    }

    function addComponent(option: string) {
        let component = {};
        if (index !== undefined) {
            switch (option) {
                case 'Header':
                    component = { title: "" };
                    break;
                case 'Paragraph':
                    component = { text: "" };
                    break;
                case 'Markdown':
                    component = { md: "" };
                    break;
                case 'HTML':
                    component = { html: "" };
                    break;
                case 'Number List':
                    component = { numberedList: [{ text: '', id: 0, subItems: [] }] };
                    break;
                case 'Bullet List':
                    component = { bulletList: [{ text: '', id: 0, subItems: [] }] };
                    break;
            }
            editComponentContents.update((contents) => {
                contents.splice(index, 0, component);
                return contents;
            });
            closeMenu(); // Close the menu after adding a component
        }
    }
</script>

<div
    class="add-component-menu absolute z-50 border border-primary-200 border-2 bg-surface-950 text-surface rounded-xl shadow-lg flex w-80"
    style="top: {menuPosition.y}px; left: {menuPosition.x}px;"
>
    <!-- Left Column (Categories) -->
    <div class="w-2/5 border-r border-primary-200 pr-2">
        {#each Object.keys(menuOptions) as category}
            <button
                type="button"
                class={`w-full text-left px-3 py-2 rounded-md transition-colors
                    hover:bg-surface-50 hover:text-primary-contrast-50
                    focus:outline-none focus:bg-surface-50
                    ${selectedCategory === category ? 'bg-surface-100 text-primary-contrast-50 font-medium' : 'text-surface'}`}
                on:click={() => selectCategory(category as keyof typeof menuOptions)}
            >
                {category}
            </button>
        {/each}
    </div>
    <!-- Right Column (Options) -->
    <div class="w-3/5 pl-2">
        {#if selectedCategory}
            {#each menuOptions[selectedCategory] as option}
                <button
                    type="button"
                    class="w-full text-left px-3 py-2 rounded-md text-surface transition-colors hover:bg-surface-50 hover:text-primary-contrast-50 focus:bg-gray-200"
                    on:click={() => addComponent(option)}
                >
                    {option}
                </button>
            {/each}
        {:else}
            <div class="px-3 py-2 text-gray-500">Select a category</div>
        {/if}
    </div>
</div>