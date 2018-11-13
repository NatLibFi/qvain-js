<template>
	<div>
		<!-- (oneof component) -->
		<div class="clearfix">
		<b-dropdown right text="choose type" variant="primary" class="m-2 float-right">
			<b-dropdown-item v-for="(sub, i) in schema['oneOf']" :key="'oneOfSel' + i" @click="setChosen(i)">{{ sub['title'] || '#'+i }}</b-dropdown-item>
		</b-dropdown>
		<span class="text-muted">oneOf "{{ schema.title }}", chosen: #{{ chosen }} ({{ chosen !== null ? schema['oneOf'][chosen]['title'] || "[no name]" : "" }})</span>
		<p>currentType: {{ currentType }}</p>
		<p>possibleTypes: {{ possibleTypes }}</p>
		xxx
		</div>


		<b-textarea v-if="false" :rows="15" :value="JSON.stringify(schemaForChosen, null, 2)"></b-textarea>

		<TabSelector v-if="chosen !== null" :schema="schemaForChosen" :path="newPath('oneOf/' + chosen)" :value="value" :parent="parent" :property="property" :tab="myTab" :activeTab="activeTab" 
		:depth="depth" :key="'oneOf-'+chosen"></TabSelector>

	</div>
</template>

<script>
import vSchemaBase from './base.vue'

// TODO: find a more generic way to detect relevant oneOf schema
const IDENTIFYING_FIELD = '@type'

export default {
	extends: vSchemaBase,
	name: 'schema-oneof',
	description: "generic oneof",
	schematype: 'any',
	data: function() {
		return {
			chosen: null,
		}
	},
	methods: {
		setChosen(i) {
			// don't reset the data if the same option is selected again as the watcher won't trigger
			if (this.chosen === i) return

			// throw away data on type switch to avoid collisions and irrelevant stray fields
			this.$store.commit('updateValue', {
				p: this.parent,
				prop: this.property,
				val: undefined,
			})
			this.chosen = i
		},
	},
	computed: {
		schemaForChosen() {
			return this.chosen !== null ? this.schema['oneOf'][this.chosen] : {}
		},
		possibleTypes() {
			return this.schema['oneOf'].map(sub => sub['title'])
			//return this.schema['oneOf'].map(sub => { "x" })
		},
		currentType() {
			return this.value && this.value[IDENTIFYING_FIELD] || null
		},
	},
	watch: {
		chosen() {
			console.log("type changed, must delete data", this.property, this.value)
		},
		currentType: {
			immediate: true,
			handler(val) {
				console.log("currentType watcher called with val", val, this.possibleTypes)
				if (!val) return

				let index = this.possibleTypes.indexOf(this.currentType)
				this.chosen = index >= 0 ? index : null
			}
		},
	},
	created() {
		console.warn("oneOf created()")
	},
}
</script>
