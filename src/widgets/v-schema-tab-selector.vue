<template>
	<div>
		<!-- schema-tab-selector -->
		<div v-if="showWidgets">
			<p>ui widgets</p>
			<select v-model="customWidget">
				<option v-for="(constructor, name) in this.$options.components" :key="constructor">{{ name }}</option>
			</select>
		</div>

		<div v-if="showTypeSelector">
			<p>this schema has multiple possible types; please choose one</p>
			<select v-model="dataType">
				<option disabled value="">Please select one</option>
				<option v-for="type in possibleTypes" :key="type">
					{{ type }}
				</option>
			</select>
		</div>

		<!-- actual component -->
		<!-- keep-alive -->
		<component v-if="activeTab === myTab" :class="[ activeTab === myTab ? 'righttab': 'wrongtab']" :is="widget" v-bind="widgetProps" :schema="schema" :path="path" :value="parent[property]" :valtype="dataType" :parent="parent" :property="property" :hasTypeError="hasTypeError" :tab="myTab" :activeTab="activeTab" :depth="newdepth" v-on="$listeners">
			<p>{{ dataType }}</p>
		</component>
		<skip v-else :schema="schema" :path="path" :value="parent[property]" :valtype="dataType" :parent="parent" :property="property" :hasTypeError="hasTypeError" :tab="myTab" :activeTab="activeTab" :depth="depth" v-on="$listeners"></skip>
		<!-- <div style="color: #eeeeee;">hidden myTab: {{ myTab }} {{ typeof myTab }} tab: {{ tab }} {{ typeof tab }} active: {{ activeTab }} {{ typeof activeTab }}</div> -->

	</div>
</template>

<script>
import vSchemaNumber from './v-schema-number.vue'
import vSchemaString from './v-schema-string.vue'
import vSchemaObject from './v-schema-object.vue'
import vSchemaArray from './v-schema-array.vue'
import vSchemaInlineArray from './v-schema-inline-array.vue'
import vSchemaAnyOf from './v-schema-anyof.vue'
import vSchemaAllOf from './v-schema-allof.vue'
import WidgetGoogleMaps from './widget-googlemaps.vue'
import refdataList from './refdata/list.vue'
import i18nString from './i18n-string/i18n-string.vue'
import TabbedArray from './TabbedArray.vue'
import AutoComplete from './refdata/autocomplete.vue'
import Filebrowser from '../filebrowser/filebrowser.vue'
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
	props: ['schema', 'value', 'path', 'parent', 'property', 'tab', 'activeTab', 'depth'],
	data: function() {
		return {
			dataType: null,
			hasTypeError: false,
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
		},
		emptyValue: function() {
			switch (this.dataType) {
				case 'object':
					return {}
				case 'array':
					return []
				case 'null':
					return null
				//default:
			}
			return undefined
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
		vivicate: function(force) {
			//console.log("value:", this.value, "path:", this.path, "parent:", this.parent, "prop:", this.property, "exists:", this.property !== undefined && (this.property in this.parent))
			if (this.value !== undefined && !force) {
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

			// if we don't have a parent, we're changing the top level; set the record to the correct empty value
			/*
			if (this.parent === undefined || this.parent === "") {
				console.warn("tab-selector: no parent for", this.path)
				//this.$store.commit('loadData', this.emptyValue())
				return
			}
			*/

			this.$store.commit('initValue', { p: this.parent, prop: this.property, val: this.emptyValue() })
			//this.$store.commit('initValue', { p: this.parent, prop: this.property, val: {} })
			/*
			else {
				this.$set(target, key, "abc")
			}
			*/
		},
	},
	computed: {
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
			console.log(`widget chain for ${this.path}:`, this.selectedWidget, this.uiForSchema['widget'], this.uiForDef['widget'], this.defaultWidget(this.dataType))
			return this.selectedWidget || this.uiForSchema.widget || this.uiForDef.widget || this.defaultWidget(this.dataType)
		},
		widgetProps: function() {
			return this.uiForSchema.props || this.uiForDef.props || undefined
		},
		/*
		ui: function() {
			return Object.assign({}, this.uiForDef, this.uiForSchema)
		},
		*/
		ui: function() {
			// if there was a $ref, use that ref's ui as default and load this path's on top of it
			if (this.schema['$deref']) {
				return Object.assign({}, this.$store.state.hints[this.schema['$deref']], this.$store.getters.uiForPath(this.path))
			}
			return this.$store.getters.uiForPath(this.path)
		},
		uiForSchema: function() {
			//return this.$store.state.hints[this.path] || this.uiDefHint || {}
			return this.$store.getters.uiForPath(this.path)
		},
		uiForDef: function() {
			return ('$deref' in this.schema && this.$store.state.hints[this.schema['$deref']]) || {}
		},
		uiTab: function() {
			return this.$store.state.hints[this.path] && this.$store.state.hints[this.path]['tab']
		},
		myTab: function() {
			return typeof this.uiTab === 'string' ? this.uiTab : this.tab
		},
		newdepth: function() {
			//console.log("depth:", this.depth, typeof this.depth)
			return 'tab' in this.uiForSchema ? 1 : this.depth + 1
		},
	},
	watch: {
		schema: function() {
			console.log("selector: schema watcher ran")
			//if (this.$store.state.record === undefined) {
			//if (!this.path && this.value === undefined) {
			if (this.value === undefined) {
				console.log("schema change, undefined value")
				this.setDataType(this.schema['type'])
				this.vivicate()
			}
		},
		value: function() {
			console.log("selector: value watcher ran")
			//if (this.$store.state.record === undefined) {
			//if (!this.path && this.value === undefined) {
			if (this.value === undefined) {
				console.log("data change, undefined value")
				this.setDataType(this.schema['type'])
				this.vivicate()
			}
			if (this.value !== undefined && this.dataType === 'array' && typeof this.value !== 'object') {
				console.error("[selector/value] array expected for path", this.path, "got:", typeof this.value)
				this.hasTypeError = true
				this.vivicate(true)
			}
			if (this.value !== undefined && this.dataType === 'object' && typeof this.value !== 'object') {
				console.error("[selector/value] array expected for path", this.path, "got:", typeof this.value)
				this.hasTypeError = true
				this.vivicate(true)
			}
		},
	},
	components: {
		//'schema': vSchemaSchema,
		'schema-number': vSchemaNumber,
		'schema-string': vSchemaString,
		'schema-object': vSchemaObject,
		'schema-array': vSchemaArray,
		'schema-inline-array': vSchemaInlineArray,
		'schema-anyof': vSchemaAnyOf,
		'schema-allof': vSchemaAllOf,
		'widget-googlemaps': WidgetGoogleMaps,
		'refdata-list': refdataList,
		'i18n-string': i18nString,
		'tabbed-array': TabbedArray,
		'autocomplete': AutoComplete,
		'browser': Filebrowser,
		'skip': Skip,
	},
	created() {
		console.log("schema-tab-selector(", this.path, "): calling setDataType (created) with", this.schema['type'], "and calling vivicate()")
		this.setDataType(this.schema['type'])

		if (this.value !== undefined && this.dataType === 'array' && typeof this.value !== 'object') {
			console.error("[selector/created] array expected for path", this.path, "got:", typeof this.value)
			this.hasTypeError = true
			this.vivicate(true)
		}
		if (this.value !== undefined && this.dataType === 'object' && typeof this.value !== 'object') {
			console.error("[selector/created] object expected for path", this.path, "got:", typeof this.value)
			this.hasTypeError = true
			this.vivicate(true)
		}
		if (this.value === undefined) {
			this.vivicate()
		}
	},
	mounted() {
		this.$nextTick(function () {
			// Code that will run only after the
			// entire view has been rendered
			console.warn("v-tab-selector mounted triggered: READY")
		})
	},
}
</script>
