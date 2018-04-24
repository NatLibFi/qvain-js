import Vue from 'vue'

import vSchemaNumber from './v-schema-number.vue'
import vSchemaString from './v-schema-string.vue'
import vSchemaObject from './v-schema-object.vue'
import vSchemaArray from './v-schema-array.vue'
import WidgetGoogleMaps from './widget-googlemaps.vue'
//import refdataList from './refdata/list.vue'

export default {
	name: 'schema-selector',
	description: "internal dispatch wrapper",
	schematype: 'any',
	/*
	props: {
		schema: Object,
	},
	*/
	props: ['schema', 'value', 'path', 'parent', 'property', 'tab'],
	data: function() {
		return {
			valType: "",
			verbose: false,
			showWidgets: false,
			customWidget: undefined,
		}
	},
	methods: {
		setValType: function(schemaType) {
			if (typeof schemaType === 'object' && schemaType instanceof Array) {
				this.valType = schemaType[0]
			} else {
				this.valType = schemaType
			}
			//this.$emit('typeChanged', this.valType)
		},
		defaultWidget: function(schemaType) {
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
				console.log("schema-selector: `any` not implemented yet")
				return ""
			default:
				console.log("schema-selector: unknown schemaType")
				return ""
			}
		},
		vivicate: function() {
			console.log("vivicate():", this.path, "value:", this.value)
			
			if (this.value === undefined) {
				console.log("UNDEFINED", this.path)
				var target, key
				
				if (this.parent === undefined || this.parent === "") {
					console.log("setting parent to store, path:", this.path)
					target = this.$store.state
					key = 'record'
				} else {
					console.log("setting parent to parameter")
					target = this.parent
					key = this['property']
				}
				
				if (this.schema['type'] === 'object') {
					//this.value = {}
					Vue.set(target, key, {})
					console.log("set value to empty object")
				} else if (this.schema['type'] === 'array') {
					//this.value = []
					Vue.set(target, key, [])
					console.log("set value to empty array")
				}
				/*
				else {
					Vue.Set(target, key, null)
					console.log("set value to null")
				}
				*/
			}
		},
	},
	computed: {
		showTypeSelector: function() {
			// type can be array or string
			return typeof this.schema['type'] === 'object'
		},
		widget: function() {
			//return this.valType ? "schema-" + this.valType : ""
			//return this.defaultWidget(this.valType)
			return this.customWidget || this.defaultWidget(this.valType)
		},
		uiTab: function() {
			return this.$store.state.hints[this.path] && this.$store.state.hints[this.path]['tab']
		},
		myTab: function() {
			console.log("uiTab:", this.uiTab, this.$store.state.hints[this.path])
			return typeof this.uiTab === 'number' ? this.uiTab : this.tab
		},
	},
	watch: {
		schema: function() {
			console.log("schema-selector(", this.path, "): calling setValType (watch) with", this.schema['type'])
			this.setValType(this.schema['type'])
			
			console.log("calling vivicate() from watcher")
			this.vivicate()
			
			/*
			console.log("destroying children", this.$children)
			this.$children.forEach(child => child.$destroy())
			console.log("destroyed children", this.$children)
			this.$forceUpdate()
			*/
			this.$children.forEach(child => console.log("child:", child))
			//this.$children = []
			//console.log("set children to empty list", this.$children)
		},
	},
	components: {
		//'schema': vSchemaSchema,
		'schema-number': vSchemaNumber,
		'schema-string': vSchemaString,
		'schema-object': vSchemaObject,
		'schema-array': vSchemaArray,
		'widget-googlemaps': WidgetGoogleMaps,
		//'refdata-list': refdataList,
	},
	created() {
		console.log("schema-selector(", this.path, "): calling setValType (created) with", this.schema['type'])
		this.setValType(this.schema['type'])
		//console.log("config:", this.$root, this.$root.DEBUG)
		//console.log(this.$options.components)
		console.log("calling vivicate() from created()")
		this.vivicate()
	},
}
