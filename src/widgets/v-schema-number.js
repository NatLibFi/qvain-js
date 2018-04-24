import vSchemaBase from './v-schema-base.vue'

// from Vue code
function toNumber(val) {
	const n = parseFloat(val, 10)
	return (n || n === 0) ? n : val
}


export default {
	extends: vSchemaBase,
	name: 'schema-number',
	description: "generic number",
	schematype: 'number',
	data: function() {
		return {
			label: "",
			feedback: "",
			state: null,
		}
	},
	methods: {
		deleteMe: function(event) {
			console.log("schema-number: removal requested", event, this.property)
			this.$parent.$emit("delete", this.property)
		},
		updateValue: function(e) {
			//console.log("this:", this.parent, this.property, this.parent[this.property], e.target.value, this.$store.state.latitude)
			//this.$store.commit('updateValue', { this.parent[this.property], e.target.value })
			/*
			let p = this.parent
			let prop = this.property
			let val = e.target.value
			console.log("parent:", p, prop, val, typeof val, typeof e.target.value)
			this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: val })
			*/
			this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: toNumber(e.target.value) })
		},
	},
	computed: {
		inArray: function() {
			return typeof property === 'number'
		},
		makeLabel: function() {
			return this.schema['title'] || String(this.property) || "number"
		},
		liveState: function() {
			//console.log("number state:", this.schema['.q'] ? this.schema['.q']['v'] : null)
			return '.q' in this.schema ? this.schema['.q']['v'] : null
		},
	},
	created() {
		//console.log("v-schema-number:", this, this.$data)
	},
}
