//import {pathToData} from '../schematodata.js'
//import vSchemaNumber from './v-schema-number.vue'
//import vSchemaString from './v-schema-string.vue'
//import vSchemaObject from './v-schema-object.vue'
//import Mapping from './mapping.js'

/* This creates cyclic dependencies because the components are nested: A creates a B which creates an A.
 * 
 * If you are lucky enough to get a warning, it will look like this:
 * 
 *   Failed to mount component: template or render function not defined.
 * 
 * You often won't get a warning, things just don't work correctly, like missing props.
 * 
 * Apparently ES6 doesn't support lazy loading yet. You can't create an intermediate function either,
 * because you will always have the import statements on top. So the only way is to load components lazily
 * when the component is being created by using old module syntax in Webpack.
 * 
 * See also:
 *   https://vuejs.org/v2/guide/components.html#Circular-References-Between-Components
 */

export default {
	name: 'schema-base',
	description: "base widget that all ui widgets inherit from",
	props: ['schema', 'value', 'valtype', 'parent', 'property', 'path', 'tab', 'activeTab'],
	methods: {
		newPath: function(prop) {
			//return lvl !== undefined ? this.path + '/' + lvl : this.path
			//if (lvl === undefined) return this.path
			//return this.path.length > 0 ? this.path + '/' + lvl : this.path
			return this.path + '/' + prop
		},
	},
	computed: {
		showPath: function() {
			return this.path.length > 0 ? this.path : "root"
		},
		ui: function() {
			return this.$store.getters.uiForPath(this.path)
		},
		uiTab: function() {
			//return this.$store.state.hints[this.path] && this.$store.state.hints[this.path]['tab']
			return this.ui['tab']
		},
		myTab: function() {
			return typeof this.uiTab === 'number' ? this.uiTab : this.tab
		},
		uiTitle: function() {
			return this.ui['title'] || this.schema['title']
		},
		uiDescription: function() {
			return this.ui['description'] || this.schema['description']
		},
		uiHelp: function() {
			return this.ui['help']
		},
		uiPlaceholder: function() {
			return this.ui['placeholder']
		},
	},
	beforeCreate: function () {
		//this.$options.components.TreeFolderContents = require('./tree-folder-contents.vue')
		
		/*
		this.$options.components['schema-number'] = require('./v-schema-number.vue')
		this.$options.components['schema-string'] = require('./v-schema-string.vue')
		this.$options.components['schema-object'] = require('./v-schema-object.vue')
		this.$options.components['schema-selector'] = require('./v-schema-selector.vue')
		this.$options.components['schema-array'] = require('./v-schema-array.vue')
		*/
		
		//console.log("c1:", this.$options.components)
		
		//this.$options.components = require('./mapping.js').default
		for (var component in require('./mapping.js').default) {
			this.$options.components[component] = require('./mapping.js').default[component]
		}
		
		//this.$options.components = require('./mappinges6.js')
		
		//console.log("c2:", this.$options.components)
		
		/*
		for (var component in Mapping) {
			console.log(component, Mapping[component])
			this.$options.components[component] = require('./v-' + component + '.vue')
		}
		*/
	},
	/*
	components: {
		'schema-number': vSchemaNumber,
		'schema-string': vSchemaString,
		'schema-object': vSchemaObject,
	},
	*/
}
