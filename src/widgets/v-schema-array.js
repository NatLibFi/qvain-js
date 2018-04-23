//import {SchemaTypes} from './schemaparser.js'
import vSchemaBase from './v-schema-base.vue'
//import uiComponents from './uicomponents.js'
//import vSchemaSelector from './v-schema-selector.vue'

export default {
	extends: vSchemaBase,
	name: 'schema-array',
	description: "generic array",
	schematype: 'array',
	data: function() {
		return {
			children: [],
			minimum: 0,
			maximum: 0,
		}
	},
	methods: {
		doMinus: function() {
			// it's safe to pop() a zero-length array
			if (this.children.length > this.minimum) this.children.pop()
		},
		doPlus: function() {
			//if (this.maximum === undefined || this.children.length < this.maximum) this.children.push('')
			if (this.maximum === undefined || this.value.length < this.maximum) this.value.push('')
			console.log("didPlus, length now:", this.value.length)
		},
		deleteElement: function(index) {
			console.log("schema-array: request to delete element with index", index, "value:", this.children[index])
			if (index >= 0 && index < this.children.length) {
				this.children.splice(index, 1)
			} else {
				console.log("deleteElement: attempt to remove non-existing element at index", index)
			}
		},
		schemaForChild: function(index) {
			if (this.isTuple) {
				var additionalSchema = typeof this.schema['additionalItems'] === 'object' ? this.schema['additionalItems'] : {}
				
				return index < this.schema['items'].length ? this.schema['items'][index] : additionalSchema
			} else {
				return this.schema['items']
			}
		},
		init: function() {
			this.minimum = typeof this.schema['minItems'] === 'number' && this.schema['minItems'] > 0 ? this.schema.minItems : 0
			this.maximum = typeof this.schema['maxItems'] === 'number' && this.schema['maxItems'] > 0 ? this.schema.maxItems : undefined
			console.log("schema-array: set min/max", this.minimum, this.maximum)
			if (this.isTuple && !this.allowAdditional) this.maximum = this.schema['items'].length
		},
	},
	computed: {
		isTuple: function() {
			// list or tuple validation?
			return this.schema['items'] instanceof Array
		},
		allowAdditional: function() {
			// additionalItems: true if missing, true if true, true when object; false if false
			return this.schema['additionalItems'] !== false
		},
	},
	watch: {
		schema: function() {
			return this.init()
		},
	},
	created() {
		return this.init()
	},
	//components: uiComponents,
}
