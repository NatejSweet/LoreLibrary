<script lang="ts">
	import Edge from '$lib/components/editComponents/theme/generator/Edges/EdgeOption.svelte';

	interface EdgesProps {
		thickness?: boolean;
		name: string;
		value: string;
		items: string[];
		gridCols?: string; 
	}

	// prettier-ignore
	let {
		thickness = false,
		name,
		value = $bindable(),
		items = [],
		gridCols = 'grid-cols-7'
	}: EdgesProps = $props();

	function setValue(v: string) {
		value = v;
		document.documentElement.style.setProperty(`--${name}`, v);
	}
</script>

<div>
	<!-- Hidden Input -->
	<input {name} type="hidden" />
	<!-- Selection List -->
	<div class="grid {gridCols} gap-4">
		{#each items as itemValue}
			<Edge value={itemValue} active={value} onselect={setValue} {thickness} />
		{/each}
	</div>
</div>
