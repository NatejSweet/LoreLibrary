<script lang="ts">
    import { onMount } from 'svelte';
    import DeleteComponentButton from "./deleteComponentButton.svelte";
    import StyleComponentButton from "./componentStyling/styleComponentButton.svelte";
    export let index: number;
    export let type: string;
    let disabledOwner: string | null = null;

    onMount(() => {
        const font = getComputedStyle(document.documentElement).getPropertyValue('--base-font-family').trim();
        console.log(font);
    });
</script>
<div class="text-base font-normal space-y-2 flex flex-col" style={"font-family: var(--base-font-family);"}>
    <DeleteComponentButton index={index} bind:disabledOwner={disabledOwner}/>
    <StyleComponentButton index={index} type={type} bind:disabledOwner={disabledOwner}/>
</div>




