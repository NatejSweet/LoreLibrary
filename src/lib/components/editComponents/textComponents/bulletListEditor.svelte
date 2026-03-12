<script lang="ts">
    import { editComponentContents } from '$lib/state/editState.svelte';
	import ComponentControls from '../controls/componentControls.svelte';
    import MoveComponentButtons from '../controls/moveComponentButtons.svelte';
	import {getClass, getStyle} from "$lib/scripts/componentStyling";
	import { tick } from 'svelte';

    export let bullets: Bullet[] = [];
    export let index: number;
	export let onDragStart: (index: number) => void = () => {};
    export let onDrop: (index: number) => void = () => {};

	let focusId: string | null = null;
	let inputs: Record<string, HTMLInputElement> = {};
	type Bullet = {
		id: string
		text: string
		depth: number
	}

    function syncToStore() {
		editComponentContents.update((contents) => {
			const next = [...contents];
			const existing = next[index] ?? {};
			next[index] = { ...existing, bulletList: bullets };
			return next;
		});
	}

	function focusBullet(index: number, cursorPos?: number) {
		const bullet = bullets[index];
		if (!bullet) return;

		const el = inputs[bullet.id];
		if (!el) return;

		el.focus();

		if (cursorPos !== undefined) {
			const pos = Math.min(cursorPos, el.value.length);
			el.setSelectionRange(pos, pos);
		}
	}

	async function addBullet(index: number) {
		const newBullet = {
			id: crypto.randomUUID(),
			text: "",
			depth: bullets[index].depth
		};

		bullets.splice(index + 1, 0, newBullet);
		bullets = bullets;

		let focusId = newBullet.id;

		await tick();

		inputs[focusId]?.focus();
	}

	function indentBullet(index: number) {
		if (index === 0) return;

		bullets[index].depth += 1;
		bullets = bullets;
	}

	function outdentBullet(index: number) {
		bullets[index].depth = Math.max(0, bullets[index].depth - 1);
		bullets = bullets;
	}

	function handleKey(e: KeyboardEvent, index: number) {
		const input = e.target as HTMLInputElement;
		const cursor = input.selectionStart ?? 0;

		switch (e.key) {
			case "Enter":
				e.preventDefault();
				addBullet(index);
				break;
			case "Tab":
				e.preventDefault();
				if (e.shiftKey) {
					outdentBullet(index);
				} else {
					indentBullet(index);
				}
				break;
			case "Backspace":
				if (cursor === 0) {
					e.preventDefault();
					if (bullets[index].text === "") {
						bullets.splice(index, 1);
						bullets = bullets;
						focusBullet(index - 1);
					} else {
						outdentBullet(index);
						focusBullet(index, cursor);
					}
				}
				break;
			case "ArrowUp":
				e.preventDefault();
				focusBullet(index - 1, cursor);
				break;
			case "ArrowDown":
				e.preventDefault();
				focusBullet(index + 1, cursor);
				break;
		}
	}

	function updateText(index: number, e: Event) {
		bullets[index].text = (e.target as HTMLInputElement).value;
		bullets = bullets;
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
			<ul class="list-disc ml-5">
				{#each bullets as bullet, i (bullet.id)}
					<li class="" style="margin-left:{bullet.depth * 20}px; max-width: calc(100% - {bullet.depth * 20}px)}">
						<input
							bind:this={inputs[bullet.id]}
							value={bullet.text}
							on:input={(e) => updateText(i, e)}
							on:keydown={(e) => handleKey(e, i)}
							size={Math.max(1, bullet.text.length)}
							class="w-full max-w-full"
						/>
					</li>
				{/each}
				</ul>
		</div>
		<ComponentControls index={index} type="bl" />
    </div>
</div>