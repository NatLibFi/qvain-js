<template>
	<div>
		<!-- (tabbed-array component) -->

		<b-card no-body>
			<b-tabs card v-model="tabIndex">
				<b-tab :title="el && tabField && el[tabField] ? el[tabField] : `#${i + 1}`" v-for="(el, i) in value" :key="i">
					Tab Contents {{i}}<br/>
					(min: {{ minimum }} / max: {{ maximum || '-' }})<br/>
					title: {{ uiTitle }}<br/>
					description: {{ uiDescription }}<br/>
					label: {{ uiLabel }}<br/>
					<b-btn size="sm" variant="danger" class="float-right" :disabled="value.length <= minimum" @click="()=>closeTab(i)">Delete entry</b-btn>
					<b-btn size="sm" @click="tabIndex = 2">sel-2</b-btn>

					<component is="schema-tab-selector" :schema="schemaForChild(i)" :path="newPath(i)" :value="value[i]" :parent="parent[property]" :property="i" :tab="myTab" :activeTab="activeTab" :depth="depth" @delete="deleteElement"></component>
				</b-tab>

				<b-nav-item slot="tabs" :disabled="value.length >= maximum" @click.prevent="newTab" href="#">+</b-nav-item>

				<!-- no elements in array -->
				<div slot="empty" class="text-center text-muted">
					No people added
					<br> Add a new person using + button.
				</div>
			</b-tabs>
		</b-card>
		<!-- doPlus doMinus -->
	</div>
</template>

<script>
//import vSchemaBase from './v-schema-base.vue'
import vSchemaArray from './v-schema-array.vue'

export default {
	extends: vSchemaArray,
	name: 'tabbed-array',
	description: "present objects in a tabbed interface",
	schematype: 'array',
	props: {
		tabField: {
			type: String,
			default: null,
		},
	},
	data: function() {
		return {
			tabIndex: 0,
		}
	},
	methods: {
		newTab: function() {
			if (this.doPlus() && this.value.length) {
				// focus on last (new) tab when it's there
				this.$nextTick(function() {
					this.tabIndex = this.value.length - 1
				})
			}
		},
		closeTab: function(i) {
			console.log("request to delete tab", i, "with value", this.value[i])
			this.deleteElement(i)
		},
	},
}
</script>
