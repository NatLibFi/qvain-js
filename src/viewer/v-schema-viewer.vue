<template>
	<div class="container-fluid">
		<b-form-select v-model="selectedSchema" :options="getTestSchemaNames()" class="mb-3"></b-form-select>
		
		<b-alert variant="info" show>
			selected schema:
			<div v-if=selectedSchema>
				<code>{{ selectedSchema }}</code>
			</div>
			<div v-else>
				<i>none</i>
			</div>
		</b-alert>
		
		<h1 style="margin-top: 1em;">schema viewer</h1>
		
		<!-- Modal Component -->
		<!-- <b-modal id="modal1" ref="modal1" title="Edit schema UI" @ok="handleOk" @shown="clearName"> -->
		<b-modal id="modal1" ref="modal1" title="Edit schema UI">
			editing: {{ curPointer }}
			<form @submit.stop.prevent="handleSubmit">
				<b-form-input type="text" placeholder="Schema UI widget" v-model="uihint"></b-form-input>
			</form>
		</b-modal>
		
		<hint-editor ref="refHintEditor" :schema="{}" path=""></hint-editor>
		<b-btn @click="edit('blah')">open</b-btn>

		<hr/>
		<h2>schema root</h2>
		<ul class="treeview">
			<schema-tree :schema="schema" path="" name="" :pref="this" :edit="edit" tab="0"></schema-tree>
		</ul>
		
	</div>
</template>

<script>
import testSchemas from '../testschemas.js'
import vHintEditor from './hint-editor.vue'
import vSchemaTree from './v-schema-tree.vue'

export default {
	data: function() {
		return {
			selectedSchema: '',
			schemaJson: {},
			uiHints: {},
			curPointer: "/moobs",
		}
	},
	methods: {
		loadSchema: function(schemaName) {
			this.schemaJson = testSchemas[schemaName]
			this.$store.commit('loadSchema', testSchemas[schemaName])
			console.log(this.$store.state.schema)
		},
		getTestSchemaNames: function() {
			return Object.keys(testSchemas)
		},
		//edit: function(a, b, c) {
		edit: function() {
			//return this.$refs.refHintEditor.edit(a, b, c)
			return this.$refs.refHintEditor.edit.apply(this, arguments)
		},
	},
	computed: {
		schema: function() {
			return this.$store.state.schema
		},
		uihint: {
			get () {
				return this.$store.state.hints[this.curPointer]
			},
			set (value) {
				this.$store.commit('setHint', {path: this.curPointer, hint: value})
			}
		}
	},
	watch: {
		selectedSchema: function() {
			this.loadSchema(this.selectedSchema)
		},
		schemaJson: function() {
		},
	},
	components: {
		'hint-editor': vHintEditor,
		'schema-tree': vSchemaTree,
	},
	created() {
		console.log("schemaviewer:", this, this.$refs)
		this.$on('edit', function(a, b, c) {
			console.log("EVENT edit", a, b, c)
			this.curPointer = a
			this.$root.$emit('show::modal', 'modal1', b)
		})
	},
}
</script>
