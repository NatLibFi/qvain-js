<template>
	<b-form-group horizontal :label-cols="2" description="description" label="label" feedback="feedback" state="">
		<b-list-group>
			<b-list-group-item v-for="(value, index) in children" :key="index" @remove="remove(index)" :active="index == editing" @click="edit(index, $event)">
				<b-input-group>
					<b-form-input :value="value" :plaintext="index != editing" v-model="children[index]" @keyup.enter.native="editing = null" @keyup.esc.native="editing = null" @blur.native="editing = null" v-focus></b-form-input>
					<b-input-group slot="append">
						<b-btn class="btn btn-outline-danger" style="border: 0;" @click="remove(index)"><font-awesome-icon icon="minus" fixed-width class="text-dark" /></b-btn>
					</b-input-group>
				</b-input-group>
			</b-list-group-item>
		</b-list-group>
		<p v-if="children.length < 1" class="font-italic">no items</p>

		<string-list :items="children" @remove="remove" @input="childEdit" />
		<tag-list :items="children" @remove="remove" />


		<hr/>
		<b-btn type="button" variant="danger" @click="remove(index)"><font-awesome-icon icon="minus" /></b-btn>

		<b-btn type="button" variant="primary" @click="add()"><font-awesome-icon icon="plus" /> add</b-btn>

		<b-input-group>
			<b-form-input type="text" name="" placeholder="placeholder" value="" state=""></b-form-input>
			<b-input-group-append v-if="false">
				<b-btn type="button" variant="danger"><font-awesome-icon icon="minus" /></b-btn>
			</b-input-group-append>
		</b-input-group>
	</b-form-group>
</template>

<script>
import TagList from '@/components/TagList.vue'
import StringList from '@/components/StringList.vue'

export default {
	name: 'editable-list',
	data: function() {
		return {
			children: [],
			editing: null,
		}
	},
	methods: {
		add(item) {
			if (item === undefined) { item = "#" + this.children.length }
			this.children.push(item)
			this.editing = this.children.length - 1
		},
		remove(index) {
			console.log("remove() called with index:", index)
			this.children.splice(index, 1)
		},
		edit(index, event) {
			this.editing = index
			console.log("editing:", this.editing, event, event.target.children[0])
			//event.target.children[0].focus()
		},
		childEdit(value, index) {
			console.log("childEdit:", value, index)
			//this.children[index] = value
			this.$set(this.children, index, value)
		},
		hover: function(e) {
			e.target.classList.add('bg-danger')
		},
		unhover: function(e) {
			e.target.classList.remove('bg-danger')
		},
	},
	directives: {
		focus: {
			inserted: function (el) {
				el.focus()
			}
		}
	},
	components: {
		TagList,
		StringList,
	},
}
</script>
