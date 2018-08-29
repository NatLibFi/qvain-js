// dummy functional component

export default {
	name: "skip",
	functional: true,
	render: function (createElement, context) {
		//if ('properties' in this.schema) { throw Error("dummy: not an object") }
		if (!('properties' in context.props.schema)) {
			//return createElement('div', "dead leaf")
			return undefined
		}

		//console.log("dummy component, path:", context.path || '/', "context:", context)
		//console.log("dummy schema props:", Object.keys(context.props.schema.properties).map(function(key) { return createElement('p', "key:" + key) }))

		//:schema="propSchema" :path="newPath('properties/' + propName)" :value="value[propName]" :parent="value" :property="propName" :tab="myTab" :activeTab="activeTab"></component>
		//for (let k in Object.keys(this.schema.properties))

		return createElement(
			'div', Object.keys(context.props.schema.properties).map(function(key) {
				let myPath = context.props.path + '/properties/' + key
				let uiTab = context.parent.$store.state.hints[myPath] && context.parent.$store.state.hints[myPath]['tab']
				let myTab = typeof uiTab === 'number' ? uiTab : context.props.tab

				return createElement('schema-tab-selector', {
					props: {
						schema: context.props.schema.properties[key],
						path: myPath,
						value: typeof context.props.value === 'object' ? context.props.value[key] : undefined,
						parent: context.props.value,
						property: key,
						tab: myTab,
						activeTab: context.props.activeTab,
					},
				})
			}),
			context.children
		)
	},
	props: ['schema', 'path', 'value', 'parent', 'property', 'tab', 'activeTab'],
	components: {
		'schema-tab-selector': require('./v-schema-tab-selector.vue'),
	},
}
