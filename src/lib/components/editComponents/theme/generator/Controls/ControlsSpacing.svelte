<script lang="ts">
	import { settingsSpacing } from '$lib/state/generator.svelte';

	const options = [
		{ label: 'Tight', size: '0.22rem' },
		{ label: 'Base', size: '0.25rem' },
		{ label: 'Loose', size: '0.28rem' }
	];

	function set(newValue: string) {
		settingsSpacing['--spacing'] = newValue;
		document.documentElement.style.setProperty('--spacing', newValue); // Apply the change to the DOM
	}

	function activeClass(size: string) {
		return settingsSpacing['--spacing'] === size ? 'preset-filled' : 'preset-tonal';
	}
</script>

<div class="space-y-4">
	<!-- prettier-ignore -->
	<p class="opacity-60">
		Set the scale factor for <a href="https://tailwindcss.com/docs/customizing-spacing" target="_blank" class="text-inherit underline">Tailwind Spacing</a> utilities.
	</p>
	<label class="label">
		<span class="label-text">Scale Factor</span>
		<div class="grid grid-cols-3 gap-4">
			{#each options as o}
				<button type="button" class="btn {activeClass(o.size)}" onclick={() => set(o.size)}>{o.label}</button>
			{/each}
		</div>
	</label>
</div>
