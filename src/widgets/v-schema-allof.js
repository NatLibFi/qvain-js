import vSchemaBase from './v-schema-base.vue'

export default {
	extends: vSchemaBase,
	name: 'schema-allof',
	description: "generic allof",
	schematype: '',
	methods: {
	},
	computed: {
		liveState: function() {
			return '.q' in this.schema ? this.schema['.q']['v'] : null
		},
		merged: function() {
			if (typeof this.schema.allOf !== 'object') return {}
			return Object.assign({}, ...this.schema.allOf)
		},
	},
	created() {
	},
}
