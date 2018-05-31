//import vSchemaBase from './v-schema-base.vue'
import vSchemaArray from './v-schema-array.js'

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
