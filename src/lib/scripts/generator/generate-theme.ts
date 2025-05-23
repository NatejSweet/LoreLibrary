// Utility: Generate Theme
// Generates the {theme}.ts file output for users to copy into their projects.

import {
	formatCore,
	formatEdges,
	formatBackgrounds,
	formatColors,
	formatSpacing,
	formatTypography
} from '$lib/scripts/generator/format-output';
import {
	settingsCore,
	settingsColors,
	settingsBackgrounds,
	settingsTypography,
	settingsSpacing,
	settingsEdges
} from '$lib/state/generator.svelte';

export function generateTheme() {
	const _settingsCore = formatCore(settingsCore);
	const themeCss = `
[data-theme='${_settingsCore.name}'] {
${formatTypography(settingsTypography)}
${formatSpacing(settingsSpacing)}
${formatEdges(settingsEdges)}
${formatBackgrounds(settingsBackgrounds)}
${formatColors(settingsColors)}
}
`.trim();
	return themeCss;
}
