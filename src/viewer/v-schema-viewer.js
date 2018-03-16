import testSchemas from '../testschemas.js'
import vHintEditor from './hint-editor.vue'
import vSchemaTree from './v-schema-tree.vue'

export default {
	data: function() {
		return {
			selectedSchema: '',
			schemaJson: {},
			uiHints: {},
			curPointer: "/moobs",
		}
	},
	methods: {
		loadSchema: function(schemaName) {
			this.schemaJson = testSchemas[schemaName]
			this.$store.commit('loadSchema', testSchemas[schemaName])
			console.log(this.$store.state.schema)
		},
		getTestSchemaNames: function() {
			return Object.keys(testSchemas)
		},
		//edit: function(a, b, c) {
		edit: function() {
			//return this.$refs.refHintEditor.edit(a, b, c)
			return this.$refs.refHintEditor.edit.apply(this, arguments)
		},
	},
	computed: {
		schema: function() {
			return this.$store.state.schema
		},
		uihint: {
			get () {
				return this.$store.state.hints[this.curPointer]
			},
			set (value) {
				this.$store.commit('setHint', {path: this.curPointer, hint: value})
			}
		}
	},
	watch: {
		selectedSchema: function() {
			this.loadSchema(this.selectedSchema)
		},
		schemaJson: function() {
		},
	},
	components: {
		'hint-editor': vHintEditor,
		'schema-tree': vSchemaTree,
	},
	created() {
		console.log("schemaviewer:", this, this.$refs)
		this.$on('edit', function(a, b, c) {
			console.log("EVENT edit", a, b, c)
			this.curPointer = a
			this.$root.$emit('show::modal', 'modal1', b)
		})
	},
}
