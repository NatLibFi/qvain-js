//import {SchemaTypes} from './schemaparser.js'
import vSchemaBase from './v-schema-base.vue'

export default {
	extends: vSchemaBase,
	name: 'schema-string',
	description: "generic string",
	schematype: 'string',
	data: function() {
		return {
			label: "",
			feedback: "",
			state: null,
		}			
	},
	methods: {
		deleteMe: function(event) {
			console.log("schema-string: removal requested", event, this.property)
			this.$parent.$emit("delete", this.property)
		},
		updateValue: function(e) {
			//console.log("this:", this.parent, this.property, this.parent[this.property], e.target.value, this.$store.state.latitude)
			//this.$store.commit('updateValue', { this.parent[this.property], e.target.value })
			//let p = this.parent
			//let prop = this.property
			//let val = e.target.value
			//console.log("parent:", p, prop, val)
			//console.log("updateValue", '.q' in this.schema, '.q' in this.schema ? this.schema['.q']['v'] : null)
			this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: e.target.value })
			//this.state = this.schema['.q'] && e.target.value.length > 0 ? this.schema['.q']['v'] : null
		},
	},
	computed: {
		inArray: function() {
			return typeof property === 'number'
		},
		makeLabel: function() {
			return this.schema['title'] || String(this.property) || "string"
		},
		liveState: function() {
			return '.q' in this.schema ? this.schema['.q']['v'] : null
		},
	},
	created() {
		//console.log("v-schema-string:", this, this.$data)
	},
}
