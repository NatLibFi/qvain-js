import testSchemas from './testschemas.js'
import testSchemaUis from './testschemas_ui.js'
import testSchemasData from './testschemas_data.js'

import vSchemaTabSelector from './widgets/v-schema-tab-selector.vue'

//import { schemaToTabs } from './schema_to_tabs.js'

import { SchemaValidator, Validator } from '../tmp/json-schema-live/src/validate.js'


export default {
	name: "tabui",
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
			testdataValid: null,
			dataParseError: "",
			doLive: true,
			unsubscribeFunc: null,
			startTab: 0,
			validator: null,
		}
	},
	methods: {
		runValidator: function() {
			this.validator = SchemaValidator(this.$store.state.schema, this.$store.state.record)
		},
		loadSchema: function(schemaName) {
			//this.validator = SchemaValidator(testSchemas[schemaName], this.$store.state.record)
			//console.log("stats:", this.validator.o, this.validator.q, this.validator.v, this.validator.t, this.validator.f)
			//console.log("Q:", testSchemas[schemaName])
			this.$store.commit('loadSchema', testSchemas[schemaName])
			this.schemaJson = testSchemas[schemaName]
			//this.validator = SchemaValidator(this.schemaJson, this.$store.state.record)
			//this.$store.commit('loadSchema', this.schemaJson)
			/*
			const myPlugin = store => {
				// called when the store is initialized
				store.subscribe((mutation, state) => {
					// called after every mutation.
					// The mutation comes in the format of `{ type, payload }`.
					if (mutation.type == "updateValue") {
						SchemaValidator(store.state.schema, store.state.record)
					}
				})
			}
			//this.$store.plugins.push(myPlugin)
			this.$store.plugins = [myPlugin]
			*/
			
			//this.subscribeValidator()
		},
		subscribeValidator: function() {
			this.validator = new Validator(this.$store.state.schema, this.$store.state.record)
			var vm = this
			console.log("VALIDATOR:", typeof validator, typeof this.validator.validate)
			// store subscribe arguments: mutation, state
			this.unsubscribeFunc = this.$store.subscribe((mutation) => {
				//console.log(mutation.type)
				//if (mutation.type == "updateValue" || mutation.type == "loadData") {
				if (mutation.type == "updateValue") {
					console.log("data == store?", vm.validator.data == this.$store.state.record)
					//if (validator.data != this.$store.state.record) {
					//	validator.data = this.$store.state.record
					//}
					//validator.schema = this.$store.state.schema
					/*
					SchemaValidator(this.$store.state.schema, this.$store.state.record)
					console.log(mutation.type, SchemaValidator.o, SchemaValidator.q, SchemaValidator.v, SchemaValidator.t, SchemaValidator.f)
					this.$store.commit('updateStats', {
						total: SchemaValidator.v,
						pass: SchemaValidator.t,
						fail: SchemaValidator.f,
						q: SchemaValidator.q,
					})
					*/
					vm.validator.validate()
				}
			})
			//console.log("store:", this.$store, unsubscribe)
		},
		unsubscribeValidator: function() {
			this.unsubscribeFunc()
			this.unsubscribeFunc = null
		},
		toggleValidator: function() {
			this.unsubscribeFunc === null ? this.subscribeValidator() : this.unsubscribeValidator()
		},
		loadUi: function(schemaName) {
			if (schemaName in testSchemaUis) {
				this.$store.commit('loadHints', testSchemaUis[schemaName])
				console.log("loaded ui for schema:", schemaName)
			} else {
				this.$store.commit('loadHints', {})
				console.log("no ui for schema:", schemaName)
				this.startTab = 1
			}
		},
		loadData: function(schemaName) {
			//this.$store.commit('loadData', {})
			if (schemaName in testSchemasData) {
				this.testdata = JSON.stringify(testSchemasData[schemaName], null, 2)
			}
			this.$store.commit('loadData', undefined)
			console.log("reset store data")
		},
		getTestSchemaNames: function() {
			return Object.keys(testSchemas)
		},
		parseJson: function() {
			console.log("clicked parse button!")
			try {
				var tmp = JSON.parse(this.testdata)
			} catch(e) {
				this.dataParseError = e.message
				this.testdataValid = false
				console.log("testdata: NOT E")
				console.log("testdata:", e)
				console.log("testdata error:", this.dataParseError, this.dataParseError.length)
				return
			}
			this.dataParseError = ""
			this.testdataValid = true
			console.log("parsed:", tmp)
			this.value = tmp
			console.log("store update!", this.$store.state)
			//this.$store.state.record = tmp
			this.$store.commit('loadData', tmp)
			//this.$store.commit('loadSchema', this.schemaJson)
		},
		getJson: function() {
			this.testdata = JSON.stringify(this.$store.state.record || "", null, 2)
		},
	},
	computed: {},
	watch: {
		selectedSchema: function() {
			
			if (!(this.selectedSchema)) {
				console.log("selectedSchema triggered without schema!")
				return
			}
			
			//this.$children.forEach(child => child.$destroy())
			this.loadSchema(this.selectedSchema)
			this.loadUi(this.selectedSchema)
			//this.subscribeValidator()
			this.loadData(this.selectedSchema)
			this.subscribeValidator()
			this.$store.watch(() => this.$store.state.record, value => {
				console.log("store watcher: record changed")
				this.validator.data = value
			})
			//this.validator = SchemaValidator(this.$store.state.schema, this.$store.state.record)
			//let tabs = []
			//schemaToTabs(this.schemaJson, uiHints, tabs)
			//console.log("tab array:", tabs)
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
		'schema-tab-selector': vSchemaTabSelector,
	},
	created() {
		//console.log("v-schema-schema:", this, this.$data)
		//console.log("$root:", this.$root)
		//console.log("$store:", this.$store)
	},
}
