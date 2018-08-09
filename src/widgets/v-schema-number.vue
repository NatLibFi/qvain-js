<template>
	<div>
		<!-- (number widget) -->
		<b-form-group horizontal label-cols="2" :description="uiDescription" :label="makeLabel" :feedback="feedback" :state="schemaState">
			<b-input-group>
				<b-form-input id="jack" type="number" name="" :placeholder="uiPlaceholder" :step="schema['multipleOf']" :value="parent[property]" :state="schemaState" @input.native="updateValue"
				@focus.native="schemaState || $root.$emit('bv::show::popover', 'jack')" @blur.native="$root.$emit('bv::hide::popover', 'jack')"></b-form-input>
				<b-input-group-append v-if="inArray">
					<b-btn type="button" variant="danger" @click="deleteMe"><i class="fas fa-minus"></i></b-btn>
				</b-input-group-append>
			</b-input-group>
		</b-form-group>
		errors: {{ schemaErrors }} state: {{ schemaState }}/{{ !!schemaState }} {{ schemaErrors.length < 1 }} validity: {{ validity }} show? {{ showErrors }}
		<b-btn @click="$root.$emit('bv::hide::popover', 'jack')">hide</b-btn>
		<b-popover target="jack" triggers="" :show="!schemaState" title="errors" style="background-color: #660000; color: #aa0000;">{{ schemaErrors }}</b-popover>
		<!-- :show="!schemaState" -->
	</div>
</template>

<script>
import vSchemaBase from './v-schema-base.vue'

// from Vue code
function toNumber(val) {
	const n = parseFloat(val, 10)
	return (n || n === 0) ? n : val
}


export default {
	extends: vSchemaBase,
	name: 'schema-number',
	description: "generic number",
	schematype: 'number',
	data: function() {
		return {
			label: "",
			feedback: "",
			state: null,
		}
	},
	methods: {
		deleteMe: function(event) {
			console.log("schema-number: removal requested", event, this.property)
			this.$parent.$emit("delete", this.property)
		},
		updateValue: function(e) {
			//console.log("this:", this.parent, this.property, this.parent[this.property], e.target.value, this.$store.state.latitude)
			//this.$store.commit('updateValue', { this.parent[this.property], e.target.value })
			/*
			let p = this.parent
			let prop = this.property
			let val = e.target.value
			console.log("parent:", p, prop, val, typeof val, typeof e.target.value)
			this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: val })
			*/
			console.log(typeof e.target.value, typeof toNumber(e.target.value))
			//this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: toNumber(e.target.value) })
			this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: e.target.value !== "" ? toNumber(e.target.value) : undefined })
		},
	},
	computed: {
		makeLabel: function() {
			//return this.schema['title'] || (typeof this.property === 'number' ? "#" + (this.property + 1) : String(this.property)) || "number"
			return typeof this.property === 'number' ? "#" + (this.property + 1) : this.uiTitle
		},
	},
	/*
	watch: {
		'validity': function(v) {
			console.warn("schemaState watcher:", v)
			console.log("schemaState watcher:")
			if (v) {
				this.$root.$emit('bv::hide::popover', 'jack');
				this.$root.$emit('bv::disable::popover', 'jack');
			} else {
				this.$root.$emit('bv::enable::popover', 'jack');
				this.$root.$emit('bv::show::popover', 'jack');
			}
		},
	},
	*/
	created() {
		//console.log("v-schema-number:", this, this.$data)
	},
}
</script>
