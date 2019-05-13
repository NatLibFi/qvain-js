<template>
	<div>
	</div>
</template>

<script>
import genid from '@/lib/genid.js'

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
	props: ['schema', 'value', 'valtype', 'parent', 'property', 'path', 'tab', 'activeTab', 'depth', 'hasTypeError', 'required'],
	methods: {
		newPath: function(prop) {
			return this.path + '/' + prop
		},
	},
	computed: {
		isValid() {
			const statefromStore = this.$store.state.vState[this.path].v
			return statefromStore !== null ? statefromStore : true;


			//return (this.$store.state.vState[this.path].e || []).length === 0
		},
		errors() {
			const errorsFromStore = this.$store.state.vState[this.path].e
			const incorrectElements = errorsFromStore
				.filter(e => e.slice(0, 31) === 'list validation failed for item')
				.map(e => Number(e.slice(32)) +1)
				.join(', #')

			const otherErrors = errorsFromStore
				.filter(e => e.slice(0, 31) !== 'list validation failed for item')

			if (incorrectElements.length > 0) {
				otherErrors.push('Check element(s) #' + incorrectElements)
			}

			return otherErrors
		},
		showPath: function() {
			return this.path.length > 0 ? this.path : "root"
		},
		uniqId: function() {
			return this._uid
		},
		domId: function() {
			return genid(this.path)
		},
		ui: function() {
			// if there was a $ref, use that ref's ui as default and load this path's on top of it
			if (this.schema['$deref']) {
				return Object.assign({}, this.$store.state.hints[this.schema['$deref']], this.$store.getters.uiForPath(this.path))
			}
			return this.$store.getters.uiForPath(this.path)
		},
		uiTab: function() {
			return this.ui['tab']
		},
		myTab: function() {
			return typeof this.uiTab === 'number' ? this.uiTab : this.tab
		},
		uiTitle: function() {
			return this.ui['title'] || this.schema['title'] || this.property
		},
		uiDescription: function() {
			return this.ui['description'] || this.schema['description']
		},
		uiLabel: function() {
			if (this.inArray) {
				return null
			}
			const string = (this.ui['label'] || this.uiTitle)
			return string ? string.charAt(0).toUpperCase() + string.slice(1) : null
		},
		uiHelp: function() {
			return this.ui['help']
		},
		uiPlaceholder: function() {
			return this.ui['placeholder'] !== null ? this.ui['placeholder'] : this.uiLabel
		},
		inArray: function() {
			return typeof this.property === 'number'
		},
		toplevel: function() {
			return this.$store.state.hints.tabs ? 'tab' in this.ui : true
		},
	},
	beforeCreate: function () {
		for (let component in require('./mapping.js').default) {
			this.$options.components[component] = require('./mapping.js').default[component]
		}
	},
	created() {
		this.$store.commit('initStateFor', this.path)
	},
}
</script>
