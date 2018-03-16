import vSchemaBase from './v-schema-base.vue'

export default {
	extends: vSchemaBase,
	name: 'widget-googlemaps',
	created() {
		console.log("v-schema-object:", this, this.$data, this.$props)
		console.log("registered components:", this.$options.components)
	},
	//components: uiComponents,
}

/*
 *			this.children = []
 *			if (this.schema.type === 'object' && this.schema['properties']) {
 *				for (let prop in this.schema.properties) {
 *					if (this.value === undefined) {
 *						console.log("value is undefined")
 *						this.value = {}
 *					}
 *					this.children.push({
 *						path: this.path + '/' + prop,
 *						component: 'schema',
 *						schema: this.schema.properties[prop],
 *						value: this.value[prop],
 *					})
 *					this.bChildren[this.path + '/' + prop] = false
 *				}
 *			}
 */
