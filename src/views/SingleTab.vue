<template>
	<component is="schema-tab-selector"
		:schema="$store.state.schema"
		path=""
		:parent="$store.state"
		property="record"
		:value="$store.state.record"
		:activeTab="$route.params.tab"
		:depth="0">
	</component>
</template>

<script>
import jsonPointer from 'json-pointer'

import vSchemaTabSelector from '../widgets/v-schema-tab-selector.vue'

export default {
	name: 'singletab',

	data: function() {
		return {
			//schemaJson: this.$store.state.schema,
			whereisInput: null,
			whereisReply: null,
		}
	},
	methods: {
		whereis: function() {
			//this.whereisReply = 1
			if (!this.$store.state.schema) {
				this.whereisReply = "I don't know"
				return
			}

			if (!this.$store.state.hints.tabs) {
				this.whereisReply = 'probably in tab 1'
				return
			}

			let ui = this.$store.state.hints
			let tab = this.startTab

			for (let el in jsonPointer.parse(this.whereisInput)) {
				if (el in ui) {
					if ('tab' in ui.el) {
						tab = ui.el.tab
					}
					ui = ui[el]
				}
			}

			this.whereisReply = tab
		},
	},
	computed: {
		tabs() {
			return this.$store.state.hints.tabs || ['metadata']
		},
	},
	components: {
		'schema-tab-selector': vSchemaTabSelector,
	},
	created() {
		console.log("SingleTab called", this.$route.path)
	},
	mounted() {
		console.warn("mounted():", this.$store.state.schema)
	},
}
</script>
