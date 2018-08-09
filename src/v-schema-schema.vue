<template>
	<div><!-- v-schema-schema -->
		<h2 v-if="schema.title">{{ schema.title }}</h2><h2 class="metainfo missing" v-else>missing title</h2>
		<p v-if="schema.description">{{ schema.description }}</p>
		<p>
			path: <code>{{ path || 'root' }}</code><br/>
			type: <code><span v-if="schema.type">{{ schema.type }}</span><span class="meta-info missing" v-else>unknown</span></code><br/>
			ui: <code>{{ uiType }}</code><br/>
			value: <code>{{ value }}</code><br/>
			valid: <code>{{ isValid }}</code><br/>
			schema: <code>{{ schema }}</code><br/>
		</p>
		
		<div v-if="showTypeSelector">
			<p>this schema has multiple possible types; please choose one</p>
			<select v-model="uiType">
				<option disabled value="">Please select one</option>
				<option v-for="type in schema.type" :key="type">
					{{ type }}
				</option>
			</select>
		</div>

		<ul id="">
			<li v-for="child in children" :key="child">
				child, type: {{ child.component }}
				<component :is="child.component" :schema="child.schema" :path="child.path" :name="child.path" :ref="child.path" :value="child.value" v-on:validate="updateValidity"/>
			</li>
		</ul>
		
		<input type="text" name="" v-model="value" v-if="showInput"/>
	</div>
</template>

<script>
export default {
	name: 'schema',
	/*
	 *	props: {
	 *		value: {},
	 *		schema: Object,
	 *		path: String,
	 *		validity: Object,
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
	created: function() {
		/*
		 this.$on('validation', function (path, state) {
		 	console.log("validation event fired", path, state)
		})
		*/
	},
}
</script>
