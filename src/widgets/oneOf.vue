<template>
	<wrapper :wrapped="!inArray">
		<div v-if="chosen === null" class="conditional-wrapper">
			<b-dropdown class="m-2" text="choose type" variant="primary">
				<b-dropdown-item v-for="(sub, i) in schema['oneOf']"
					:key="'oneOfSel' + i"
					@click="setChosen(i)">
					{{ sub['title'] || '#'+i }}
				</b-dropdown-item>
			</b-dropdown>
			<!--<span class="text-muted">oneOf "{{ schema.title }}", chosen: #{{ chosen }} ({{ chosen !== null ? schema['oneOf'][chosen]['title'] || "[no name]" : "" }})</span>-->
			<!--<p>currentType: {{ currentType }}</p>-->
			<!--<p>possibleTypes: {{ possibleTypes }}</p>-->
		</div>
		<b-textarea v-if="false" :rows="15" :value="JSON.stringify(schemaForChosen, null, 2)"></b-textarea>
		<TabSelector
			v-if="chosen !== null"
			:schema="schemaForChosen"
			:path="newPath('oneOf/' + chosen)"
			:value="value"
			:parent="parent"
			:property="property"
			:tab="myTab"
			:activeTab="activeTab"
			:depth="depth"
			:key="'oneOf-'+chosen" />
	</wrapper>
</template>

<style lang="scss" scoped>
.conditional-wrapper {
	width: 100%;
	display: inline-flex;
	justify-content: center;
}

</style>


<script>
import Wrapper from '@/components/Wrapper.vue'
import vSchemaBase from '@/widgets/base.vue'

// TODO: find a more generic way to detect relevant oneOf schema
const IDENTIFYING_FIELD = '@type'

export default {
	extends: vSchemaBase,
	name: 'schema-oneof',
	description: "generic oneof",
	schematype: 'any',
	components: {
		Wrapper,
	},
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
			},
		},
	},
	created() {
		console.warn("oneOf created()")
	},
}
</script>
