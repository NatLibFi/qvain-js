<template>
	<TabSelector v-if="Object.keys($store.state.schema).length > 0" :schema="$store.state.schema" path="" :parent="$store.state" property="record" :value="$store.state.record" :activeTab="$route.params.tab" :depth="0"></TabSelector>
	<div v-else :style="{'padding': '20px'}">
		Please select one option from "Where are my files" menu. Note that the selected option cannot be changed without creating a new dataset.
		<br>
		<br>
		Where are your files related to this dataset:
		<ul>
			<li>In Fairdata IDA (you want to select files from IDA)" and "I want to select Fairdata IDA files"</li>
			<li>Somewhere else (you want to link files from remote location)</li>
		</ul>
	</div>
</template>

<script>
import jsonPointer from 'json-pointer'
import TabSelector from '@/widgets/TabSelector.vue'

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
		'TabSelector': TabSelector,
	},
	created() {
	},
	mounted() {
		console.warn("mounted():", this.$store.state.schema)
	},
}
</script>
