import vSchemaBase from './v-schema-base.vue'

export default {
	extends: vSchemaBase,
	name: 'schema-allof',
	description: "generic allof",
	schematype: '',
	methods: {
	},
	computed: {
		merged: function() {
			if (typeof this.schema.allOf !== 'object') return {}
			return Object.assign({}, ...this.schema.allOf)
		},
	},
	created() {
	},
}
