<template>
	<b-btn :variant="variant" :size="size" :disabled="inactive" v-b-tooltip.hover.auto title="text" @click="doit">
		<i class="fas fa-save" v-if="!inactive"></i><i class="fas fa-hourglass" v-if="inactive"></i> <slot></slot>
	</b-btn>
</template>

<style>
button svg { margin-right: 0.4rem; }
</style>

<script>
export default {
	name: "busy-button",
	props: ['type', 'size'],
	data () {
		return {
			variant: "dark",
			state: null,
			icon: "fa-save",
			inactive: false,
		}
	},
	methods: {
		doit: function() {
			this.icon = "fas-hourglass"
			this.inactive = true
		}
	},
	computed: {
		/*
		icon: function() {
			//return "fas fa-check"
			//return "fas fa-hourglass"
			return "fas fa-save"
		},
		*/
		iconClass: function() {
			return {
				'fa-save': !this.inactive,
				'fa-hourglass': this.inactive,
			}
		},
	},
}
</script>
