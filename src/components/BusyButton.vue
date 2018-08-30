<template>
	<b-btn :variant="variant" :size="size" :disabled="inactive" v-b-tooltip.hover.auto title="text" @click="doit">
		<font-awesome-icon :icon="icon.faSave" v-if="!inactive" />
		<font-awesome-icon :icon="icon.faHourglass" v-if="inactive" />
		<slot></slot>
	</b-btn>
</template>

<style>
/* button svg { margin-right: 0.4rem; } */
</style>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSave, faHourglass } from '@fortawesome/free-solid-svg-icons'

export default {
	name: 'busy-button',
	props: ['type', 'size'],
	data() {
		return {
			variant: 'dark',
			state: null,
			icon: {
				faSave,
				faHourglass,
			},
			inactive: false,
		}
	},
	methods: {
		doit: function() {
			this.icon = 'fas-hourglass'
			this.inactive = true
		},
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
	components: {
		FontAwesomeIcon,
	},
}
</script>
