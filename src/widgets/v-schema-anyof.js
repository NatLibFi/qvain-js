//import {SchemaTypes} from './schemaparser.js'
import vSchemaBase from './v-schema-base.vue'
//import uiComponents from './uicomponents.js'
//import vSchemaSelector from './v-schema-selector.vue'

export default {
	extends: vSchemaBase,
	name: 'schema-anyof',
	description: "generic anyof",
	schematype: '',
	computed: {
		liveState: function() {
			return '.q' in this.schema ? this.schema['.q']['v'] : null
		},
	},
	created() {
	},
}
