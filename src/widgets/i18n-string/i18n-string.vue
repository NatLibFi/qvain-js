<template>
	<div>
		<!-- i18n-string -->
		<b-form-group id="i18n-string" horizontal label-cols="2" breakpoint="md" :description="uiDescription" :label="uiLabel">
			<b-card no-body> <!-- :header="'<h5>' + ui['label'] + '</h5>'" -->
				<b-list-group flush>
					<b-list-group-item v-for="(val, lang) in lpairs" :key="lang">
						<div class="d-flex w-100 justify-content-start"> <!-- d-flex w-100 justify-content-between -->
							<component :is="htmlTag" class="my-1">{{val}} <sup class="langlabel">{{lang}}</sup></component>
							<!-- small style="margin-left: 0.5em; margin-top: -0.5em; vertical-align: top;">{{lang}}</small -->
							<b-btn class="ml-auto p-2" variant="danger" @click="deleteLang(lang)"><i class="fas fa-minus"></i></b-btn>
						</div>
					</b-list-group-item>
				</b-list-group>
				<b-card-body>
					<b-container>
					<b-row>
					<b-col cols="9" class="mr-3 p-0">
						<b-form-input id="i18n-string-newvalue" type="text" name="i18n-string-newvalue" :placeholder="uiPlaceholder" v-model="newString" :state="stringState" @input="resetState()"></b-form-input>
					</b-col>
					<b-col class="mr-3 p-0">
						<b-form-input size="3" maxlength="3" id="i18n-string-newlang" type="text" name="i18n-string-newlang" placeholder="language" v-model="newLanguage" :state="langState" @input="resetState()" v-if="freeform"></b-form-input>
						<b-form-select v-model="newLanguage" :options="languages" :state="langState" @change="resetState()" v-else></b-form-select>
					</b-col>
					<b-btn @click="addPair()"><span class="fas fa-plus"></span></b-btn>
					</b-row>
					</b-container>
				</b-card-body>
			</b-card>
		</b-form-group>
	</div>
</template>

<style>
sup.langlabel {
	//font-variant: small-caps;
	font-size: smaller;
}
</style>

<script>
import vSchemaBase from '../v-schema-base.vue'
import langCodes2 from '../../data/iso639-1.json'

export default {
	extends: vSchemaBase,
	name: 'i18n-string',
	description: "a string with support for multiple languages",
	schematype: 'object',
	props: {
		freeform: {
			type: Boolean,
			default: false,
		},
		isTitle: {
			type: Boolean,
			default: false,
		},
	},
	data: function() {
		return {
			newString: null,
			newLanguage: null,
			pairs: {
				"en": "English title for the dataset",
				"nl": "Nederlandse titel voor de dataset",
			},
			languages: langCodes2,
			label: "",
			feedback: "",
			state: null,
			stringState: null,
			langState: null,
			htmlTag: this.isTitle ? 'h5' : 'span',
		}
	},
	methods: {
		addPair: function() {
			console.log(this.newString, this.newLanguage)
			// validate language
			if (!this.newLanguage || (this.freeform && (this.newLanguage.length < 2 || this.newLanguage.length > 3)) || (!this.freeform && !(this.newLanguage in this.languages))) {
				this.langState = false
			}
			// validate string
			if (!this.newString) {
				this.stringState = false
			}
			// if invalid, quit
			if (this.stringState === false || this.langState === false) {
				return
			}
			//this.$set(this.pairs, this.newLanguage, this.newString)
			//this.$set(this.lpairs, this.newLanguage, this.newString)
			console.log(this.value, this.lpairs)
			//this.lpairs[this.newLanguage] = this.newString
			//this.$set(this.lpairs, this.newLanguage, this.newString)
			
			// setter doesn't run
			this.value[this.newLanguage] = this.newString
			this.updateValue()
			//this.$set(this.value, this.newLanguage, this.newString)
			//this.lpairs['xx'] = "wlekfjklwejf"
			//this.$set(this.lpairs, "xx", "testing testing")
			//this.lpairs = {'xx': "testing title"}
			//this.lpairs['xx'] = "testing title"
			this.newLanguage = this.newString = null
			//this.langState = this.stringState = true
			this.resetState()
		},
		deleteLang: function(key) {
			delete this.value[key]
			this.updateValue()
			//this.$delete(this.value, key)
		},
		resetState: function() {
			if (!this.langState || !this.stringState) {
				this.langState = this.stringState = null
			}
		},		
		updateValue: function() {
			//this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: e.target.value })
			this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: this.value })
		},
	},
	computed: {
		lpairs: {
			get: function() {
				console.log("getter called")
				return this.value
			},
			set: function(value) {
				console.log("setter called with value", value)
				//this.$store.commit('updateValue', value)
				this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: value })
			},
		},
	},
	created() {
		//console.log("!!! i18n-string:", this, this.path, this.$props, this.$data, this.value, typeof this.value)
		//this.value['xx'] = "Language string test value"
		//this.updateValue()
		//console.log("VALUE:", this.value, this.parent)
	},
}
</script>
