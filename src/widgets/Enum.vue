<template>
	<div>
		<!-- (enum widget) -->
		<b-form-group :label-cols="2" :description="uiDescription" :label="makeLabel" :feedback="feedback" :state="isValid">
			<b-form-select :placeholder="uiPlaceholder" :value="value" @input.native="updateValue" :options="toOptions" />
			<div slot="invalid-feedback">{{ errors.join(';') }}</div>
		</b-form-group>
	</div>
</template>

<script>
import vSchemaBase from './base.vue'

export default {
	extends: vSchemaBase,
	name: 'schema-enum',
	description: 'basic enum widget',
	schematype: 'string', // any?
	data: function() {
		return {
			feedback: '',
			options: [
				"one",
				"two",
				null,
				"four",
				undefined,
				{
					"type": "blahtype",
					"value": "blahvalue",
				},
				13,
				"last option",
			].map(x => { return {value: x, text: typeof x === "object" && x !== null ? JSON.stringify(x) : String(x)} }),
		}
	},
	methods: {
		updateValue: function(e) {
			this.$store.commit('updateValue', {
				p: this.parent,
				prop: this.property,
				val: e.target.value,
			})
		},
		setDefault: function() {
			if (!this.schema) return
			if (this.value !== undefined) return

			if (this.schema.default) {
				this.$store.commit('updateValue', {
					p: this.parent,
					prop: this.property,
					val: this.schema.default,
				})
				return
			}
			if (this.schema.enum.length === 1) {
				this.$store.commit('updateValue', {
					p: this.parent,
					prop: this.property,
					val: this.schema.enum[0],
				})
				return
			}
		},
	},
	computed: {
		makeLabel: function() {
			return typeof this.property === 'number' ? '#' + (this.property + 1) : this.uiTitle
		},
		toOptions() {
			return this.schema && this.schema.enum ?
				this.schema.enum.map(x => { return {value: x, text: typeof x === "object" && x !== null ? JSON.stringify(x) : String(x)} }) : []
		},
	},
	directives: {
		focus: {
			inserted: function (el) {
				el.focus()
			},
		},
	},
	created() {
		this.setDefault()
	},
}
</script>
