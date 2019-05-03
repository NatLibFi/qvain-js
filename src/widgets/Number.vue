<template>
	<div>
		<!-- (number widget) -->
		<b-form-group label-cols="2" :description="uiDescription" :label="makeLabel" :feedback="feedback" :state="isValid">
			<b-input-group>
				<b-form-input id="jack" type="number" name="" :placeholder="uiPlaceholder" :step="schema['multipleOf']" :value="parent[property]" :state="isValid" @input.native="updateValue" @focus.native="isValid || $root.$emit('bv::show::popover', 'jack')" @blur.native="$root.$emit('bv::hide::popover', 'jack')"></b-form-input>
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
import vSchemaBase from './base.vue'

function toNumber(val) {
	const n = parseFloat(val, 10)
	return n || n === 0 ? n : val
}

export default {
	extends: vSchemaBase,
	name: 'schema-number',
	description: 'generic number',
	schematype: 'number',
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
			this.$parent.$emit('delete', this.property)
		},
		updateValue: function(e) {
			this.$store.commit('updateValue', {
				p: this.parent,
				prop: this.property,
				val: e.target.value !== '' ? toNumber(e.target.value) : undefined,
			})
		},
	},
	computed: {
		makeLabel: function() {
			return typeof this.property === 'number'
				? '#' + (this.property + 1)
				: this.uiTitle
		},
	},
	components: {
		FontAwesomeIcon,
	},
}
</script>
