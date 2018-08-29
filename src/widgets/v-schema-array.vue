<template>
	<b-card no-body sub-title="uiDescription" class="my-3">
		<h3 slot="header"><i class="fas fa-angle-right"></i> {{ uiTitle }}</h3>

		<b-card-body>
		<b-alert variant="danger" dismissible :show="!!error" @dismissed="error = null">{{ error }}</b-alert>
		<p class="card-text text-muted" v-if="uiDescription"><sup><i class="fas fa-quote-left text-muted"></i></sup> {{ uiDescription }}</p>
		</b-card-body>
		<!-- b-form-group id="" :label-cols="4" :description="uiDescription" :label="uiLabel" :horizontal="true" -->
		<b-list-group flush>
			<b-list-group-item v-for="(child, index) in value" :key="index">
			<!-- style="border-left: 2px solid #aaaaaa; padding-left: 1em; margin-left: 1em;" -->
				<component is="schema-tab-selector" :schema="schemaForChild(index)" :path="newPath(index)" :value="value[index]" :parent="parent[property]" :property="index" :tab="myTab" :activeTab="activeTab" :depth="depth" @delete="deleteElement"></component>
			</b-list-group-item>
			<b-list-group-item v-if="!children || children.length < 1"><i>no items</i></b-list-group-item>
		</b-list-group>
		<!-- /b-form-group -->
		<b-card-footer>
			list <button type="button" :disabled="!children || children.length <= this.minimum" @click="doMinus">-</button> | <button type="button" :disabled="this.children.length >= this.maximum" @click="doPlus">+</button>
			(min: {{ minimum }} / max: {{ maximum || '-' }})
		</b-card-footer>

	</b-card>
</template>

<script>
import vSchemaBase from './v-schema-base.vue'

export default {
	extends: vSchemaBase,
	name: 'schema-array',
	description: "generic array",
	schematype: 'array',
	data: function() {
		return {
			//children: [],
			minimum: 0,
			maximum: 0,
			error: null,
		}
	},
	methods: {
		doMinus: function() {
			// it's safe to pop() a zero-length array
			//if (this.children.length > this.minimum) this.children.pop()
			if (this.value.length > this.minimum) this.$store.commit('popValue', { p: this.parent, prop: this.property, val: this.value })
		},
		doPlus: function() {
			//if (this.maximum === undefined || this.children.length < this.maximum) this.children.push('')
			//if (this.maximum === undefined || this.value.length < this.maximum) this.value.push('')
			if (this.maximum === undefined || this.value.length < this.maximum) {
				//this.value.push({})
				this.$store.commit('pushValue', { p: this.parent, prop: this.property, val: this.value })
				return true
			}
			return false
			console.log("didPlus, length now:", this.value.length)
		},
		deleteElement: function(index) {
			console.log("schema-array: request to delete element with index", index, "value:", this.children[index])
			if (index >= 0 && index < this.children.length) {
				this.children.splice(index, 1)
			} else {
				console.log("deleteElement: attempt to remove non-existing element at index", index)
			}
		},
		schemaForChild: function(index) {
			if (this.isTuple) {
				var additionalSchema = typeof this.schema['additionalItems'] === 'object' ? this.schema['additionalItems'] : {}

				return index < this.schema['items'].length ? this.schema['items'][index] : additionalSchema
			} else {
				return this.schema['items']
			}
		},
		init: function() {
			console.log("array widget:", "hasTypeError:", this.hasTypeError, "typeof:", typeof this.value, this.value)
			/*
			if (!Array.isArray(this.value)) {
				console.warn("array widget: value is not an array")
				this.error = "initial data was not an array; reset. " + (typeof this.value)
				this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: [] })
			}
			*/
			if (this.hasTypeError) {
				this.error = "initial data was not an array; data has been reset"
			}

			this.minimum = typeof this.schema['minItems'] === 'number' && this.schema['minItems'] > 0 ? this.schema.minItems : 0
			this.maximum = typeof this.schema['maxItems'] === 'number' && this.schema['maxItems'] > 0 ? this.schema.maxItems : undefined
			//console.log("schema-array: set min/max", this.minimum, this.maximum)
			if (this.isTuple && !this.allowAdditional) this.maximum = this.schema['items'].length
		},
	},
	computed: {
		isTuple: function() {
			// list or tuple validation?
			return this.schema['items'] instanceof Array
		},
		allowAdditional: function() {
			// additionalItems: true if missing, true if true, true when object; false if false
			return this.schema['additionalItems'] !== false
		},
		children: {
			cache: false,
			get: function() {
				if (!Array.isArray(this.value)) {
					console.warn("array widget, children: gotcha!", typeof this.value, "at", this.path)
				}
				return this.value
			},
		},
	},
	watch: {
		schema: function() {
			return this.init()
		},
	},
	created() {
		return this.init()
	},
	//components: uiComponents,
}
</script>
