import vSchemaBase from './v-schema-base.vue'
//import uiComponents from './uicomponents.js'
//import vSchemaSelector from './v-schema-selector.vue'

export default {
	extends: vSchemaBase,
	name: 'schema-object',
	description: "generic object",
	schematype: 'object',
	data: function() {
		return {
			q: "not set",
		}
	},
	watch: {
		schema: {
			handler(val) {
				//this.q = this.schema['.q']
				this.q = val['.q'] || "not set 2"
				console.log("OBJECT SCHEMA WATCHER RAN for", this.path, "val:", val)
			},
			deep: true,
		},
	},
	computed: {
		vState() {
			return this.$store.state.vState
		},
		myState: {
			cache: false,
			get: function() {
				return this.vState[this.path] || {}
			},
		},
		/*
		myState() {
			return this.vState[this.path] || {}
		},
		*/
	},
	created() {
		//console.log("v-schema-object:", this, this.$data, this.$props)
		//console.log("registered components:", this.$options.components)
	},
	//components: uiComponents,
}

/*
 *			this.children = []
 *			if (this.schema.type === 'object' && this.schema['properties']) {
 *				for (let prop in this.schema.properties) {
 *					if (this.value === undefined) {
 *						console.log("value is undefined")
 *						this.value = {}
 *					}
 *					this.children.push({
 *						path: this.path + '/' + prop,
 *						component: 'schema',
 *						schema: this.schema.properties[prop],
 *						value: this.value[prop],
 *					})
 *					this.bChildren[this.path + '/' + prop] = false
 *				}
 *			}
 */
