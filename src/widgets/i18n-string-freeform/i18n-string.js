import vSchemaBase from '../v-schema-base.vue'

export default {
	extends: vSchemaBase,
	name: 'i18n-string',
	data: function() {
		return {
			newString: null,
			newLanguage: null,
			pairs: {
				"en": "English title for the dataset",
				"nl": "Nederlandse titel voor de dataset",
			},
			label: "",
			feedback: "",
			state: null,
			stringState: null,
			langState: null,
		}
	},
	methods: {
		addPair: function() {
			console.log(this.newString, this.newLanguage)
			if (!this.newLanguage || this.newLanguage.length < 2 || this.newLanguage.length > 3) {
				this.langState = false
			}
			if (!this.newString) {
				this.stringState = false
			}
			if (this.stringState === false || this.langState === false) {
				return
			}
			this.$set(this.pairs, this.newLanguage, this.newString)
			this.newLanguage = this.newString = null
			//this.langState = this.stringState = true
			this.resetState()
		},
		deleteLang: function(key) {
			this.$delete(this.pairs, key)
		},
		resetState: function() {
			if (!this.langState || !this.stringState) {
				this.langState = this.stringState = null
			}
		},
		updateValue: function(e) {
			this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: e.target.value })
			//this.state = this.schema['.q'] && e.target.value.length > 0 ? this.schema['.q']['v'] : null
		},
	},
	computed: {
		inArray: function() {
			return typeof property === 'number'
		},
		makeLabel: function() {
			return this.schema['title'] || String(this.property) || "string"
		},
		liveState: function() {
			return '.q' in this.schema ? this.schema['.q']['v'] : null
		},
	},
	created() {
		//console.log("v-schema-string:", this, this.$data)
	},
}

