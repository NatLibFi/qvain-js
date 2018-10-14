<template>
	<div>
		<!-- (string widget) -->
		<!-- b-form-group horizontal :label-cols="inArray ? 1 : 4" :description="uiDescription" :label="makeLabel" :feedback="feedback" :state="schemaState" -->
		<b-form-group horizontal :label-cols="2" :description="uiDescription" :label="makeLabel" :feedback="feedback" :state="schemaState">
			<b-input-group>
				<b-form-input :type="inputType" name="" :placeholder="uiPlaceholder" :value="value" :state="schemaState" @input.native="updateValue"></b-form-input>
				<b-input-group-append v-if="inArray">
					<b-btn type="button" variant="danger" @click="deleteMe">
						<font-awesome-icon :icon="icon.faMinus" />
					</b-btn>
				</b-input-group-append>
			</b-input-group>
		</b-form-group>

	</div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faMinus } from '@fortawesome/free-solid-svg-icons'
import vSchemaBase from './v-schema-base.vue'

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
      icon: {
        faMinus,
      },
		}
	},
	methods: {
		deleteMe: function(event) {
			console.log('schema-string: removal requested', event, this.property)
			this.$parent.$emit('delete', this.property)
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
		},
	},
	computed: {
		makeLabel: function() {
			//return this.schema['title'] || (typeof this.property === 'number' ? "#" + (this.property + 1) : String(this.property)) || "string"
      return typeof this.property === 'number'
        ? '#' + (this.property + 1)
        : this.uiTitle
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
	},
	created() {
		//console.log("v-schema-string:", this, this.$data)
  },
  components: {
    FontAwesomeIcon,
	},
}
</script>
