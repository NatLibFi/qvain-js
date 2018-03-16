import vSchemaSchema from './v-schema-schema.vue'

export default {
	name: 'schema',
	/*
	props: {
		value: {},
		schema: Object,
		path: String,
		validity: Object,
	},
	*/
	props: ['value', 'schema', 'path', 'validity'],
	data: function() {
		return {
			title: "",
			//children: {},
			children: [],
			bChildren: {},
			isValid: false,
			uiType: "",
			//showInput: false,
		}
	},
	methods: {
		updateValidity: function(path, valid) {
			console.log("updateValidity:", path, valid)
			if (this.bChildren[path] !== valid) {
				this.bChildren[path] = valid
				//this.$emit('validate', this.path, this.calculateValidity())
				this.isValid = this.calculateValidity()
			}
		},
		calculateValidity: function() {
			return Object.keys(this.bChildren).every(x => this.bChildren[x])
		},
		setUiType: function(schemaType) {
			if (typeof schemaType === 'object' && schemaType instanceof Array) {
				this.uiType = schemaType[0]
			} else {
				this.uiType = schemaType
			}
		},
	},
	computed: {
		showInput: function() {
			//return this.schema.type === 'string' || this.schema.type === 'number'
			return this.uiType === 'string' || this.uiType === 'number'
		},
		showTypeSelector: function() {
			console.log("showTypeSelector", typeof this.uiType)
			return typeof this.schema['type'] === 'object'
		}
	},
	watch: {
		schema: function() {
			this.setUiType(this.schema['type'])
			this.children = []
			if (this.schema.type === 'object' && this.schema['properties']) {
				for (let prop in this.schema.properties) {
					if (this.value === undefined) {
						console.log("value is undefined")
						this.value = {}
					}
					this.children.push({
						path: this.path + '/' + prop,
						component: 'schema',
						schema: this.schema.properties[prop],
						value: this.value[prop],
					})
					this.bChildren[this.path + '/' + prop] = false
				}
			}
		},
		isValid: function() {
			this.$emit('validate', this.path, this.isValid, 'blah')
			this.$emit('validateParent', this.path, this.isValid, 'blah')
		},
		value: function() {
			if (this.schema.type === 'object' && this.schema['properties']) {
				for (let el in this.value) {
					let p = this.path + '/' + el
					for (let child in this.children) {
						if (this.children[child].path === p) {
							this.children[child].value = this.value[el]
						}
					}
				}
			}
			this.isValid = (typeof this.value === 'string' && this.value.length > 0) || (typeof this.value === 'number')
		}
	},
	/*
	beforeCreate: function () {
		this.$options.components.schema = vSchemaSchema
		console.log("schema:", this, "(name: ", this.name, ")")
	},
	components: {
		'schema': vSchemaSchema,
	},
	*/
	created: function() {
		/*
		this.$on('validation', function (path, state) {
			console.log("validation event fired", path, state)
		})
		*/
	},
}
