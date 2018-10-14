<template>
	<p class="font-italic text-muted text-centered" style="margin: 0.5rem 0; padding: 0;"><font-awesome-icon icon="pen" fixed-width class="mr-1" /> <slot>nothing here yet</slot></p>
</template>

export default {
	name: 'empty-note',
	props: {
		inArray: {
			type: Boolean,
			default: false,
		},
	},
}
