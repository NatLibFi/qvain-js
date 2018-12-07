<template>
	<wrapper>
		<!--<header>
			<h3>
			{{ uiTitle }}
			<font-awesome-icon v-if="value.length < minimum"
				icon="exclamation-triangle"
				class="text-dark"
				v-b-tooltip.hover="`You need at least ${minimum}!`" />
			</h3>
		</header>-->
		<!--<b-alert variant="danger" dismissible :show="!!error" @dismissed="error = null">{{ error }}</b-alert>-->
		<!--<div class="float-right" v-for="e in schemaErrors">
			<b-badge variant="danger" class="q-validation-error">
				<font-awesome-icon icon="exclamation-triangle" fixed-width/>
				{{ e }}
			</b-badge>
		</div>-->

		<b-form-group :label-cols="2" :description="uiDescription" :label="uiTitle" :state="schemaState">
			<b-list-group flush>
				<b-list-group-item class="list-item" v-for="(child, index) in value" :key="index">
					<component is="schema-tab-selector"
						:schema="schemaForChild(index)"
						:path="newPath(index)"
						:value="value[index]"
						:parent="parent[property]"
						:property="index"
						:tab="myTab"
						:activeTab="activeTab"
						:depth="depth"
						@delete="deleteElement"
						:key="'array-' + index">
					</component>
				</b-list-group-item>
				<b-list-group-item v-if="!value || value.length < 1"><empty-note>no items, add one!</empty-note></b-list-group-item>
			</b-list-group>
			<div slot="invalid-feedback">{{ schemaErrors.join(';') }}</div>
		</b-form-group>
		<footer>
			list <button type="button" :disabled="!value || value.length <= this.minimum" @click="doMinus">-</button> | <button type="button" :disabled="value.length >= this.maximum" @click="doPlus">+</button>
			(min: {{ minimum }} / max: {{ maximum || '-' }})
			{{ schemaErrors }}
		</footer>

	</wrapper>
</template>
<style lang="scss" scoped>
.list-item {
	margin-bottom: 20px;
    border-bottom: 0;
	border-top: 0;
	padding: 0;
}
</style>


<script>
import vSchemaBase from './v-schema-base.vue'
import ValidationPopover from '@/components/ValidationPopover.vue'
import Wrapper from '../components/Wrapper.vue';

export default {
	extends: vSchemaBase,
	name: 'schema-array',
	description: "generic array, nested",
	schematype: 'array',
	components: {
		ValidationPopover,
		Wrapper
	},
	data: function() {
		return {
			error: null,
			minimum: 0,
			maximum: 0,
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
				//this.value.push({})
				this.$store.commit('pushValue', { p: this.parent, prop: this.property, val: undefined })
				console.log("didPlus, length now:", this.value.length)
				return true
			}
			return false
		},
		deleteElement: function(index) {
			console.log("schema-array: request to delete element with index", index, "value:", this.value[index])
			if (index >= 0 && index < this.value.length) {
				this.value.splice(index, 1)
			} else {
				console.log("deleteElement: attempt to remove non-existing element at index", index)
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
	},
	created() {
		if (this.value == undefined) {
			console.log("array: undefined value for path", this.path)
		}
		console.log("array: typeof", this.path, typeof this.value)
		return this.init()
	},
}
</script>
