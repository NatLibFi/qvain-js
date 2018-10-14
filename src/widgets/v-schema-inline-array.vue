<template>
	<b-form-group class="qwidget" horizontal :label-cols="2" :description="uiDescription" :label="uiLabel" :feedback="feedback" :state="schemaState">
		<b-card no-body border-variant="light">
			<b-list-group flush>
				<b-list-group-item v-for="(child, index) in value" :key="index" @remove="remove(index)">
					<component is="schema-tab-selector" :schema="schemaForChild(index)" :path="newPath(index)" :value="value[index]" :parent="parent[property]" :property="index" :tab="myTab" :activeTab="activeTab" :depth="depth" @delete="deleteElement"></component>
				</b-list-group-item>
				<empty-note v-if="value.length < 1">no items</empty-note>
			</b-list-group>

			<b-alert dismissible variant="warning" :show="dismissCountDown" @dismissed="resetWarning()">
				<p>{{ warning }}</p>
			</b-alert>

			<b-card-footer>
				<div class="d-flex align-items-stretch float-right"><!-- buttons -->
					<b-btn type="button" variant="secondary" class="mr-2"><font-awesome-icon icon="list" fixed-width class="mr-2"/> <span>{{ minimum || "–" }} / {{ value.length }} / {{ maximum || "–" }}</span></b-btn>
					<b-btn type="button" variant="primary" :disabled="value.length >= this.maximum" @click="doPlus()"><font-awesome-icon icon="plus" fixed-width /></b-btn>
				</div>
			</b-card-footer>
		</b-card>
	</b-form-group>
</template>

<script>
import vSchemaBase from './v-schema-base.vue'

export default {
	extends: vSchemaBase,
	name: 'schema-inline-array',
	description: 'generic array, inline',
	schematype: 'array',
	data: function() {
		return {
			minimum: 0,
			maximum: 0,
			feedback: "very well, I feed back",
			warning: null,
			dismissSecs: 5,
			dismissCountDown: 0,
		}
	},
	methods: {
		doMinus: function() {
			// it's safe to pop() a zero-length array
			if (this.value.length > this.minimum) {
				this.$store.commit('popValue', { p: this.parent, prop: this.property, val: this.value })
				return true
			}
			return false
		},
		doPlus: function() {
			if (this.maximum === undefined || this.value.length < this.maximum) {
				this.$store.commit('pushValue', {
					p: this.parent,
					prop: this.property,
					val: undefined,
				})
				console.log('didPlus, length now:', this.value.length)
				return true
			} else {
				this.showWarning("You've added the maximum allowed amount.")
			}
			return false
		},
		deleteElement: function(index) {
			console.log('schema-array: request to delete element with index', index, 'value:', this.value[index])
			if (index >= 0 && index < this.value.length) {
				this.value.splice(index, 1)
			} else {
				console.log('deleteElement: attempt to remove non-existing element at index', index)
			}
		},
		schemaForChild: function(index) {
			if (this.isTuple) {
				let additionalSchema = typeof this.schema['additionalItems'] === 'object' ? this.schema['additionalItems'] : {}

				return index < this.schema['items'].length ? this.schema['items'][index] : additionalSchema
			} else {
				return this.schema['items']
			}
		},
		init: function() {
			this.minimum = typeof this.schema['minItems'] === 'number' && this.schema['minItems'] > 0 ? this.schema.minItems : 0
			this.maximum = typeof this.schema['maxItems'] === 'number' && this.schema['maxItems'] > 0 ? this.schema.maxItems : undefined
			if (this.isTuple && !this.allowAdditional) this.maximum = this.schema['items'].length
		},
		showWarning(msg) {
			this.warning = msg
			this.dismissCountDown = this.dismissSecs
		},
		resetWarning() {
			this.dismissCountDown = 0
			this.warning = null
		},
		add() {},
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
	},
	watch: {
		schema: function() {
			return this.init()
		},
	},
	created() {
		if (this.value == undefined) {
			console.log("array: undefined value for path", this.path)
		}
		console.log("inline-array: typeof", this.path, typeof this.value, 'items' in this.schema)
		return this.init()
	},
}
</script>
