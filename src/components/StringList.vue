<template>
	<b-list-group>
		<b-list-group-item v-for="(value, index) in items" :key="index" @click="edit(index, $event)">
			<b-form-input :value="value" :plaintext="index != editing" @input.native="$emit('input', $event.target.value, index)" @keyup.enter.native="editing = null" @keyup.esc.native="editing = null" @blur.native="editing = null" v-focus></b-form-input>
		</b-list-group-item>
		<p v-if="items.length < 1" class="font-italic">no items</p>
	</b-list-group>

</template>

<script>
export default {
	name: 'string-list',
	props: ['items'],
	data: function() {
		return {
			editing: null,
		}
	},
	methods: {
		edit(index, event) {
			this.editing = index
			console.log("editing:", this.editing, event, event.target.children[0])
			//event.target.children[0].focus()
		},
	},
	watch: {
		items(val, old) {
			if (val.length > old.length) {
				console.log("added")
				this.editing = val.length - 1
			}
		},
	},
	directives: {
		focus: {
			inserted: function (el) {
				el.focus()
			},
		},
	},
}
</script>
