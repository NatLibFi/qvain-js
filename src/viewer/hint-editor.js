// this wraps a modal component to set its contents

import Widgets from '../widgets/mapping.js'

// eslint-disable-next-line no-unused-vars
var genericWidgetOption = {
	'value': null,
	'text': "none (generic widget)"
}

// eslint-disable-next-line no-unused-vars
function isEmpty(obj) {
	for (var key in obj) {
		if (obj.hasOwnProperty(key))
			return false
	}
	return true
}

function filterKeys(obj, valid) {
	return Object.keys(obj)
		.filter(key => key in valid)
		.reduce((newobj, key) => {
			newobj[key] = obj[key]
			return newobj
		}, {})
}

function ObjectOrNull(obj) {
	return Object.getOwnPropertyNames(obj).length > 0 ? obj : null
}

export default {
	name: 'hint-editor',
	props: {
		//path: String,
		//schema: Object,
	},
	data: function() {
		return {
			path: null,
			widgetList: this.listWidgets(),
			customWidget: null,
			customWidgetOptions: {},
			inputCustomWidgetOption: null,
			label: "",
			help: "",
			placeholder: "",
			myTab: 2,
		}
	},
	methods: {
		listWidgets: function() {
			return Object.keys(Widgets).sort().reduce((result, item) => {
				result.push({
					'value': item,
					'text': item + ": " + (Widgets[item]['description'] || "– no description for this widget"),
				})
				return result
			}, [])
		},
		edit: function(path) {
			console.log("editor called with path:", path)
			this.path = path
			this.$refs['edit-modal'].show()
		},
		open: function() {
			let hints = this.$store.state.hints[this.path] || {}
			//this.ui = this.$store.state.hints[this.path] || {}

			this.customWidget = hints['widget'] || null
			this.customWidgetOptions = hints['options'] || {}
			this.help = hints['help'] || ""
		},
		save: function() {
			// if isEmpty()
			//console.log("valid:", this.validWidgetOptions)
			this.$store.commit('setHints', {
				path: this.path,
				hints: {
					widget: this.customWidget,
					options: ObjectOrNull(this.validWidgetOptions),
					label: this.label,
					help: this.help,
					placeholder: this.placeholder,
					tab: this.myTab,
				}
			})
		},
	},
	computed: {
		listWidgetOptions: function() {
			if (!this.customWidget) return null
			if (!(this.customWidget in Widgets)) return null
			//if (!Widgets[this.customWidget]['props']) return null
				
			return Widgets[this.customWidget]['props']
		},
		validWidgetOptions: function() {
			return filterKeys(this.customWidgetOptions, this.listWidgetOptions)
		},
		/*
		hints: {
			get() {
				return this.$store.state.hints[this.path]
			},
			set(value) {
				this.$store.commit('setHint', {path: this.path, hints: value})
			}
		},
		*/
	},
	created: function() {
	},
}
