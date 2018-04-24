import vSchemaNumber from './v-schema-number.vue'
import vSchemaString from './v-schema-string.vue'
import vSchemaObject from './v-schema-object.vue'
import vSchemaArray from './v-schema-array.vue'
import vSchemaAnyOf from './v-schema-anyof.vue'
import vSchemaAllOf from './v-schema-allof.vue'
import WidgetGoogleMaps from './widget-googlemaps.vue'
import refdataList from './refdata/list.vue'
import i18nString from './i18n-string/i18n-string.vue'

import Skip from './skip.js'

const COMBINERS = ['anyOf', 'allOf', 'oneOf', 'not']

export default {
	name: 'schema-tab-selector',
	description: "internal dispatch wrapper",
	widgettype: 'any',
	/*
	props: {
		schema: Object,
	},
	*/
	props: ['schema', 'value', 'path', 'parent', 'property', 'tab', 'activeTab'],
	data: function() {
		return {
			dataType: null,
			verbose: false,
			showWidgets: false,
			customWidget: null,
		}
	},
	methods: {
		setDataType: function(schemaType) {
			if (typeof schemaType === 'object' && schemaType instanceof Array) {
				this.dataType = schemaType[0]
			} else {
				this.dataType = schemaType
			}
			//this.$emit('typeChanged', this.dataType)
		},
		handleCombiners: function() {
			for (let i in COMBINERS) {
				//console.log("combiner:", COMBINERS[i])
				if (!(COMBINERS[i] in this.schema)) continue
				
				let combiner = COMBINERS[i]
				
				if (typeof this.schema[combiner] === 'object' && this.schema[combiner] instanceof Array) {
					console.log("found combiner")
					return 'schema-' + combiner.toLowerCase()
				}
				
				console.log("invalid combiner")
				return undefined
			}
			return undefined
		},
		defaultWidget: function(schemaType) {
			//console.log("schemaType:", schemaType)
			switch(schemaType) {
			case 'string':
				return 'schema-string'
			case 'number':
				return 'schema-number'
			case 'integer':
				return 'schema-number'
			case 'object':
				return 'schema-object'
			case 'array':
				return 'schema-array'
			case 'boolean':
				console.log("schema-selector: boolean not implemented yet")
				return ""
			case 'null':
				console.log("schema-selector: null not implemented yet")
				return ""
			case undefined:
				console.log("schemaType: checking for combiners...", this.handleCombiners())
				return this.handleCombiners() || ""
				//console.log("schema-selector: `any` not implemented yet")
				//return ""
			default:
				console.log("schema-selector: unknown schemaType")
				return ""
			}
		},
		vivicate: function() {
			//console.log("value:", this.value, "path:", this.path, "parent:", this.parent, "prop:", this.property, "exists:", this.property !== undefined && (this.property in this.parent))
			if (this.value !== undefined) {
				return
			}
			
			console.log("vivicate(): undefined data for", this.path, "type:", this.dataType)

			var target, key // eslint-disable-line no-unused-vars

			// the parent of the root path is the store
			if (this.parent === undefined || this.parent === "") {
				console.log("setting parent to store")
				target = this.$store.state
				key = 'record'
			} else {
				//console.log("setting parent to parameter")
				target = this.parent
				key = this['property']
			}

			// object and arrays can have children so need to be set to something
			/*
			if (this.schema['type'] === 'object' || this.schema['properties']) {
				this.value = {}
				this.$store.commit('updateValue', { p: target, prop: this.property, val: {} })
				console.log("set value to empty object", this.$store.state.record.title, this.value)
			} else if (this.schema['type'] === 'array') {
				//this.value = []
				this.$store.commit('updateValue', { p: target, prop: this.property, val: [] })
				console.log("set value to empty array")
			}
			*/
			//console.log('updateValue from vivicate', this.parent)
			this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: this.emptyValue })
			/*
			else {
				this.$set(target, key, "abc")
			}
			*/
		},
	},
	computed: {
		emptyValue: function() {
			switch (this.dataType) {
			case 'object':
				return {}
			case 'array':
				return []
			case 'null':
				return null
			default:
			}
			return undefined
		},
		showTypeSelector: function() {
			// schema type can be array or string (or undefined)
			//return this.schema['type'] === undefined || typeof this.schema['type'] === 'object'
			return typeof this.schema['type'] !== 'string'
		},
		possibleTypes: function() {
			if (this.schema['type'] === 'object') {
				return this.schema['type']
			}
			return ["string", "number", "integer", "object", "array", "boolean", "null"]
		},
		widget: function() {
			//return this.dataType ? "schema-" + this.dataType : ""
			//return this.defaultWidget(this.dataType)
			//console.log("WIDGET ERRROR?", this.selectedWidget || this.uiHint['widget'] || this.defaultWidget(this.dataType))
			//return this.selectedWidget || this.uiHint['widget'] || this.defaultWidget(this.dataType)

			//return this.selectedWidget || this.ui['widget'] || this.defaultWidget(this.dataType)
			console.log("error will follow")
			console.log("widget chain:", this.selectedWidget, this.uiForDef['widget'], this.uiForSchema['widget'], this.defaultWidget(this.dataType))
			return this.selectedWidget || this.uiForDef['widget'] || this.uiForSchema['widget'] || this.defaultWidget(this.dataType)
		},
		ui: function() {
			return Object.assign({}, this.uiForDef, this.uiForSchema)
		},
		uiForSchema: function() {
			//return this.$store.state.hints[this.path] || this.uiDefHint || {}
			return this.$store.state.hints[this.path] || {}
		},
		uiForDef: function() {
			if ('$deref' in this.schema) {
				console.log("$deref:", this.schema['$deref'], this.$store.state.hints[this.schema['$deref']])
			}
			return '$deref' in this.schema && this.$store.state.hints[this.schema['$deref']] || {}
			//return '$deref' in this.schema ? this.$store.state.hints[this.schema['$deref']] : {}
		},
		uiTab: function() {
			return this.$store.state.hints[this.path] && this.$store.state.hints[this.path]['tab']
		},
		myTab: function() {
			return typeof this.uiTab === 'number' ? this.uiTab : this.tab
		},
	},
	watch: {
		/*
		schema: function() {
			console.log("schema-tab-selector(", this.path, "): calling setDataType (watch) with", this.schema['type'])
			this.setDataType(this.schema['type'])
			
			console.log("calling vivicate() from watcher")
			this.vivicate()
			
			//if (this.path in this.$store.state.hints) {
            //    console.log("found hint for path!")
                
            //    let hints = this.$store.state.hints[this.path]
            //    if (hints['widget'] !== undefined) {
            //        console.log("widget requested:", hints['widget'])
            //        this.selectedWidget = hints['widget']
            //   }
            //}
            
			//this.$store.commit("addTab", this.schema)
			
			//console.log("destroying children", this.$children)
			//this.$children.forEach(child => child.$destroy())
			//console.log("destroyed children", this.$children)
			//this.$forceUpdate()
			
			//this.$children.forEach(child => console.log("child:", child))
			//this.$children = []
			//console.log("set children to empty list", this.$children)
		},
		*/
	},
	components: {
		//'schema': vSchemaSchema,
		'schema-number': vSchemaNumber,
		'schema-string': vSchemaString,
		'schema-object': vSchemaObject,
		'schema-array': vSchemaArray,
		'schema-anyof': vSchemaAnyOf,
		'schema-allof': vSchemaAllOf,
		'widget-googlemaps': WidgetGoogleMaps,
		'refdata-list': refdataList,
		'i18n-string': i18nString,
		'skip': Skip,
	},
	created() {
		console.log("schema-tab-selector(", this.path, "): calling setDataType (created) with", this.schema['type'], "and calling vivicate()")
		this.setDataType(this.schema['type'])
		//console.log(this.$options.components)
		//console.log("calling vivicate() from created()")
		this.vivicate()
		//console.log("startTab:", this.tab, "activeTab:", this.activeTab)
	},
}
