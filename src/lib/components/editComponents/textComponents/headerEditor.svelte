<script lang="ts">
    export let content: string;
    export let index: number;
    import { editComponentContents } from '$lib/state/editState.svelte';

    $: syncToStore();

    function syncToStore() {
        // content = content.replace(/\n/g, '');
        editComponentContents.update((contents) => {
            contents[index] = { key: "title", value: content };
            return contents;
        });
    }
</script>

<textarea
    bind:value={content}
    on:input={() => syncToStore()}
    placeholder="Enter your text here..."
    rows="10"
    class="textarea bg-surface-500 max-w-[100%] max-h-10 border-2 border-primary-200 text-surface "
></textarea>