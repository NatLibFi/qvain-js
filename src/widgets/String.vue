<template>
	<div :id="domId">
		<!-- (string widget) -->
		<!-- b-form-group horizontal :label-cols="inArray ? 1 : 4" :description="uiDescription" :label="makeLabel" :feedback="feedback" :state="schemaState" -->

		<b-form-group v-if="!inArray" class="qwidget" :label-cols="2" :description="uiDescription" :label="makeLabel" :feedback="feedback" :state="schemaState">
			<b-form-input :type="inputType" :placeholder="uiPlaceholder" :value="value" :state="schemaState" @input.native="updateValue"></b-form-input>
			<div slot="invalid-feedback">{{ schemaErrors.join(';') }}</div>
		</b-form-group>

		<b-input-group v-else @mouseenter="hover = true" @mouseleave="hover = false" style="border: 1px solid #eeeeee;">
			<b-form-input :type="inputType" :placeholder="uiPlaceholder || '…'" :value="value" :state="schemaState" :plaintext="!editing" @input.native="updateValue" @keyup.enter.native="editing = false" @keyup.esc.native="deleteIfEmpty" @blur.native="editing = false" @click.native="editing = true" @focus.native="editing = true" v-focus></b-form-input>
			<b-input-group slot="append">
				<!-- b-btn class="btn btn-outline-danger" :class="{ btn-danger: this.editing, disabled: !this.editing }" style="border: 0;" @click="deleteMe"><font-awesome-icon :icon="ctxIcon" fixed-width class="text-dark" /></b-btn -->
				<b-btn class="btn btn-outline" :class="{ 'btn-outline-danger': this.hover, 'btn-outline-secondary': !this.hover, 'disabled': !this.hover }" style="border: 0;" @click="deleteMe" @focus="hover = true" @blur="hover = false"><font-awesome-icon :icon="ctxIcon" fixed-width /></b-btn>
			</b-input-group>
		</b-input-group>

	</div>
</template>

<script>
import vSchemaBase from './base.vue'
import { dataPointer } from '../../tmp/datapointer.js'

export default {
	extends: vSchemaBase,
	name: 'schema-string',
	description: 'generic string',
	schematype: 'string',
	data: function() {
		return {
			label: '',
			feedback: '',
			state: null,
			editing: null,
			hover: null,
		}
	},
	methods: {
		deleteMe: function(event) {
			console.log('schema-string: removal requested', event, this.property)
			this.$parent.$emit('delete', this.property)
		},
		deleteIfEmpty: function(event) {
			if (this.value === undefined || this.value.length < 1) {
				this.$parent.$emit('delete', this.property)
			} else {
				this.editing = false
			}
			console.log("hello")
		},
		updateValue: function(e) {
			//console.log("this:", this.parent, this.property, this.parent[this.property], e.target.value, this.$store.state.latitude)
			//this.$store.commit('updateValue', { this.parent[this.property], e.target.value })
			//let p = this.parent
			//let prop = this.property
			//let val = e.target.value
			//console.log("parent:", p, prop, val)
			this.$store.commit('updateValue', {
				p: this.parent,
				prop: this.property,
				val: e.target.value,
			})
			/*
			this.$store.commit('setPath', {
				path: this.datapath,
				value: e.target.value,
			})
			*/
		},
	},
	computed: {
		makeLabel: function() {
			//return this.schema['title'] || (typeof this.property === 'number' ? "#" + (this.property + 1) : String(this.property)) || "string"
			return typeof this.property === 'number' ? '#' + (this.property + 1) : this.uiTitle
		},
		inputType: function() {
			if (!('format' in this.schema)) return 'text'
			switch (this.schema['format']) {
			case 'uri':
				return 'url'
			case 'time':
				return 'time'
			case 'date':
				return 'date'
			case 'date-time':
				return 'date'
			default:
				//return "text"
			}
			return 'text'
		},
		ctxIcon() {
			//return this.editing || this.hover ? "trash" : "pen"
			return this.hover ? "trash" : "pen"
		},
		datapath() {
			return dataPointer(this.path)
		},
		dataValue() {
			//return this.$store.getters.getPath(toData(this.path)) || "not set"
			//return this.$store.getters.getPath(toData(this.path))
			//return this.$store.state.dataset['rights_holder'][this.property]
			//this.$store.getters.getPath(this.datapath)
			//console.log("dataValue() called", this.$store.getters.getPath(this.datapath))
			//return this.$store.state.dataset['rights_holder'][this.property]
			//return this.$store.getters.cachedPath(this.datapath)
			return this.$store.getters.getPath(this.datapath)
		},
	},
	directives: {
		focus: {
			inserted: function (el) {
				el.focus()
			}
		}
	},
	created() {
	},
}
</script>
