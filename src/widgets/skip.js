import keysWithOrder from '@/lib/keysWithOrder.js'

export default {
	name: "skip",
	functional: true,
	render: function (createElement, context) {
		if (!('properties' in context.props.schema)) {
			//return createElement('div', "dead leaf")
			return undefined
		}

		let keys = context.parent.$store.state.hints[context.props.path] && typeof context.parent.$store.state.hints[context.props.path]['order'] === 'object' ? keysWithOrder(context.props.schema['properties'], context.parent.$store.state.hints[context.props.path]['order']) : Object.keys(context.props.schema.properties)
		//console.log("skip: schema.properties:", context.props.schema && context.props.schema.properties || "no schema.properties")

		return createElement(
			'div',
			{ class: "q-skipped" },
			//		return createElement('b-card', { props: { 'no-body': true }, class: "my-3 q-skipped q-skipped-card border-0" }, [
			//			createElement('b-list-group', { props: { 'flush': true }, class: "border-0 q-skipped q-skipped-list-group list-group-flush" },
			keys.map(function(key) {
				//			Object.keys(context.props.schema.properties).map(function(key) {
				let myPath = context.props.path + '/properties/' + key
				let uiTab = context.parent.$store.state.hints[myPath] && context.parent.$store.state.hints[myPath]['tab']
				//let myTab = typeof uiTab === 'number' ? uiTab : context.props.tab
				let myTab = uiTab != null ? uiTab : context.props.tab
				let inSameTab = context.props.tab == myTab

				//console.log(`skip (${myPath}) from (${context.props.path}) with key (${key})`, context.props.schema.properties[key])

				console.log('skip props:', context.props)
				let child = createElement('TabSelector', {
					props: {
						schema: context.props.schema.properties[key],
						path: myPath,
						value: typeof context.props.value === 'object' ? context.props.value[key] : undefined,
						parent: context.props.value,
						property: key,
						tab: myTab,
						activeTab: context.props.activeTab,
						required: (context.props.schema.required || []).includes(key),
					},
					// don't reuse VNode
					key: key,
				})


				//return createElement('b-list-group-item', { class: "border-0 q-skipped-b-list-group-item" }, [ child ])
				//if (!inSameTab) {
				if (myTab === context.props.activeTab) {
					return createElement('b-card',
						{
							props: { 'no-body': true },
							class: "border-0 my-3 q-skipped-added-card " + (inSameTab ? "q-insametab" : ("q-notinsametab-" + myTab + "-" + uiTab + "-" + context.props.tab)),
						},
						[ child ],
					)
				}
				return child

			})
		)
	},
	props: ['schema', 'path', 'value', 'parent', 'property', 'tab', 'activeTab', 'required'],
	components: {
		'TabSelector': require('./TabSelector.vue'),
	},
}
