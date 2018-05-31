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
			this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: e.target.value })
		},
	},
	computed: {
		makeLabel: function() {
			//return this.schema['title'] || (typeof this.property === 'number' ? "#" + (this.property + 1) : String(this.property)) || "string"
			return typeof this.property === 'number' ? "#" + (this.property + 1) : this.uiTitle
		},
		inputType: function() {
			if (!('format' in this.schema)) return "text"
			switch(this.schema['format']) {
			case "uri":
				return "url"
			case "time":
				return "time"
			case "date":
				return "date"
			case "date-time":
				return "date"
			default:
				//return "text"
			}
			return "text"
		},
	},
	created() {
		//console.log("v-schema-string:", this, this.$data)
	},
}
