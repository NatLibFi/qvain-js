import testSchemas from './testschemas.js'
import vSchemaSelector from './widgets/v-schema-selector.vue'

export default {
	data: function() {
		return {
			selectedSchema: '',
			schemaJson: {},
			children: [],
			validity: {
				valid: false,
			},
			value: undefined,
			testdata: '{"latitude": 60.1830097, "longitude": 24.9595227}',
			dataParseError: "",
		}
	},
	methods: {
		loadSchema: function(schemaName) {
			this.schemaJson = testSchemas[schemaName]
		},
		getTestSchemaNames: function() {
			return Object.keys(testSchemas)
		},
		parseJson: function() {
			try {
				var tmp = JSON.parse(this.testdata)
			} catch(e) {
				this.dataParseError = e
				return
			}
			this.dataParseError = ""
			//console.log("parsed:", tmp)
			this.value = tmp
			console.log("store update!", this.$store.state)
			//this.$store.state.record = tmp
			this.$store.commit('loadData', tmp)
			this.$store.commit('loadSchema', this.schemaJson)
		},
		cuckoo: function(path, valid, tmp) {
			console.log("cuckoo:", path, valid, tmp)
		},
	},
	computed: {},
	watch: {
		selectedSchema: function() {
			//this.$children.forEach(child => child.$destroy())
			this.loadSchema(this.selectedSchema)
		},
		schemaJson: function() {
			console.log("schemaJson watcher ran")
			/*
			this.children = []
			this.children.push({
				path: '/',
				component: 'schema',
				schema: this.schemaJson,
				value: this.value,
			})
			*/
		},
	},
	components: {
		'schema-selector': vSchemaSelector,
	},
	created() {
		//console.log("v-schema-schema:", this, this.$data)
	},
}
