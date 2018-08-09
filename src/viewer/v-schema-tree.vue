<template>
<li>
	<div class="treeview-branch" :class="{bold: isFolder}" @click="toggle" @dblclick="changeType">
		<i class="fa" :class="[open ? 'fa-folder-open' : 'fa-folder']" aria-hidden="true"></i>
		{{ name || "/" }}
		
		<!-- <b-btn @click.stop="edit(path, schema)"><i class="fa fa-edit" aria-hidden="true"></i> edit</b-btn> -->
		<b-btn variant="link" size="sm" v-b-tooltip.hover.auto title="edit" @click.stop="edit(path, schema)"><i class="fa fa-edit" aria-hidden="true"></i></b-btn>
		<span :class="{ 'text-secondary': !uiTab }">{{ myTab }}</span>
		
		<!-- <span v-if="isFolder">[{{open ? '-' : '+'}}]</span> -->
	</div>
	<ul class="treeview fa-ul" v-show="open" v-if="isFolder">
		<div class="item" v-for="(sub, key) in schema" :key="sub.id">
			<schema-tree v-if="typeof sub === 'object'" class="item" :schema="sub" :path="path + '/' + key" :name="key" :pref="pref" :edit="edit" :tab="myTab" v-on="$listeners"></schema-tree>
			<li v-else><i class="fa fa-square-o" aria-hidden="true"></i> {{ key }}</li>
		</div>
		<!-- <schema-tree class="item" v-for="(sub, key) in schema" :schema="sub" :path="path + '/' + key" :name="key" :key="sub.id"></schema-tree> -->
	</ul>
</li>
</template>

<script>
export default {
	name: "schema-tree",
	/*
	props: {
		schema: Object,
		path: String,
		name: String,
	},
	*/
	props: [ "schema", "path", "name", "pref", "edit", "tab" ],
	data: function () {
		return {
			open: false
		}
	},
	computed: {
		isFolder: function() {
			return typeof this.schema === 'object'
		},
		uiTab: function() {
			return this.$store.state.hints[this.path] && this.$store.state.hints[this.path]['tab']
		},
		myTab: function() {
			return typeof this.uiTab === 'number' ? this.uiTab : this.tab
		},
	},
	methods: {
		toggle: function () {
			if (this.isFolder) {
				this.open = !this.open
			}
		},
		changeType: function () {
			if (!this.isFolder) {
				this.$set(this.schema, 'children', [])
				this.addChild()
				this.open = true
			}
		},
		addChild: function () {
			this.schema.children.push({name: 'new stuff'})
		},
		setTab: function() {
			//this.$store.hints
		},
		getHints: function() {
			return this.$store.state.hints[this.path]
		},
		showRoot: function() {
			console.log("root component:", this.$root)
		},
		editSchema: function(path, btn) {
			//this.$emit('edit')
			//this.$parent.$emit('edit')
			this.pref.$emit('edit', path, btn)
			console.log("EMIT edit to", this.pref)
		},
	},
	components: {
		'schema-tree': require("./v-schema-tree.vue").default,
	},
	created: function() {
		/*
		console.log("typeof schema:", typeof schema)
		console.log("route:", this.$route)
		console.log("parent:", this.$parent)
		console.log("root:", this.$root)
		console.log("editor ref:", this.editor)
		*/
	},
}
</script>
