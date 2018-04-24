
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
