<template>
	<span :class="variant" v-b-tooltip.hover.auto title="preservation state"><font-awesome-icon icon="archive" fixed-width/> {{ long }}</span>
</template>

<script>
import StateDefs from '@/data/preservation_state.json'

export default {
	name: "archive-state",
	props: ['state'],
	computed: {
		description: function() {
			if (!this.state) {
				return StateDefs['0']
			}
			return StateDefs[this.state] || {}
		},
		long: function() {
			return (this.description['name'] || "unknown state").toLowerCase()
		},
		short: function() {
			return (this.description['short']['en'] || this.long).toLowerCase()
		},
		numState: function() {
			return Number(this.state)
		},
		variant: function() {
			switch (this.description.type) {
			case "wait":
				return "text-secondary"
			case "fail":
				return "text-error"
			case "success":
				return "text-success"
			default:
				return "text-secondary"
			}
		},
	},
}
</script>

