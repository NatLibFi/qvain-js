<template>
	<wrapper :wrapped="true">

		<b-form-group label-cols="2" breakpoint="md" :description="uiDescription" :label="uiLabel">
			<b-list-group flush>
				<b-list-group-item v-for="(val, lang) in lpairs" :key="lang">

					<b-input-group style="border: 0px solid #cccedd; padding-left: 0rem;">
						<b-form-input type="text" :value="editing == lang ? editingInput : val" :plaintext="editing != lang" @input.native="editingInput = $event.target.value" @keyup.enter.native="stopEditing(lang)" @keyup.esc.native="resetEditing(lang)" @blur.native="stopEditing(lang)" @click.native="startEditing(lang)" @focus.native="startEditing(lang)"></b-form-input>
						<b-input-group slot="append">
							<b-btn class="btn btn-outline-light" style="border: 0;" v-b-tooltip.hover :title="languages[lang]"><span class="text-dark font-italic">{{ lang }}</span></b-btn>
							<b-btn class="btn btn-outline-danger" style="border: 0;" @click="deleteLang(lang)"><font-awesome-icon icon="trash" fixed-width class="text-dark" /></b-btn>
						</b-input-group>
					</b-input-group>

				</b-list-group-item>
			</b-list-group>
			<b-card-body v-if="!lpairs || Object.keys(lpairs).length < 1"><p class="font-italic text-muted text-centered"><font-awesome-icon icon="pen" fixed-width /> nothing here yet</p></b-card-body>

			<b-container fluid>
				<b-row>
					<b-col cols="9" class="mr-3 p-0">
						<b-form-input :id="domId + '-newvalue'" type="text" :placeholder="uiPlaceholder" v-model="newString" :state="stringState" @input="resetState()"></b-form-input>
					</b-col>
					<b-col class="mr-3 p-0">
						<b-form-input size="3" maxlength="3" id="i18n-string-newlang" type="text" name="i18n-string-newlang" placeholder="language" v-model="newLanguage" :state="langState" @input="resetState()" v-if="freeform"></b-form-input>
						<language-select v-model="newLanguage" :state="langState" @change.native="resetState()" @blur.native="resetState()" @focus.native="resetState()" v-else></language-select>
					</b-col>
					<b-btn @click="addPair()" variant="primary">
						<font-awesome-icon icon="plus" fixed-width />
					</b-btn>
				</b-row>
			</b-container>
		</b-form-group>
	</wrapper>
</template>

<style>
sup.langlabel {
  /* font-variant: small-caps; */
  /*font-size: smaller;*/
}
</style>

<script>

import vSchemaBase from '../base.vue';
import langCodes2 from '../../data/iso639-1.json';
import LanguageSelect from '@/components/LanguageSelect.vue';
import Wrapper from '@/components/Wrapper.vue';

export default {
	extends: vSchemaBase,
	name: 'i18n-string',
	description: 'a string with support for multiple languages',
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
			selectPlaceholder: "– language –",
			newString: null,
			newLanguage: null,
			languages: langCodes2,
			label: '',
			feedback: '',
			state: null,
			stringState: null,
			langState: null,
			htmlTag: this.isTitle ? 'h5' : 'span',
			editing: null,
			editingInput: null,
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

			this.$store.commit('updateValue', {
				p: this.value,
				prop: this.newLanguage,
				val: this.newString,
			})

			this.newLanguage = this.newString = null
			this.resetState()
		},
		deleteLang: function(lang) {
			this.$store.commit('deleteValue', {
				p: this.value,
				prop: lang,
			})
		},
		resetState: function() {
			if (!this.langState || !this.stringState) {
				this.langState = this.stringState = null
			}
		},
		updateValue: function() {
			//this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: e.target.value })
			this.$store.commit('updateValue', {
				p: this.parent,
				prop: this.property,
				val: this.value,
			})
		},
		updateLang: function(e, lang) {
			this.$store.commit('updateValue', {
				p: this.value,
				prop: lang,
				val: e.target.value,
			})
		},
		setLang: function(lang) {
			this.$store.commit('updateValue', {
				p: this.value,
				prop: lang,
				val: this.editingInput,
			})
		},
		startEditing: function(lang) {
			// don't run this twice so the value doesn't get reset accidently
			if (this.editing == lang) { return }

			this.editingInput = this.value[lang] || ""
			this.editing = lang
		},
		stopEditing: function(lang) {
			// don't run on invalid input if we somehow get out of sync
			if (this.editing !== lang) { return this.resetEditing() }

			if (!this.editingInput || this.editingInput.length < 1) {
				this.deleteLang(lang)
			} else {
				this.$store.commit('updateValue', {
					p: this.value,
					prop: lang,
					val: this.editingInput,
				})
			}
			this.resetEditing()
		},
		resetEditing: function() {
			this.editing = null
			this.editingInput = null
		},
		deleteIfEmpty: function(e, lang) {
			if (this.value === undefined || this.value.length < 1) {
				//this.$parent.$emit('delete', this.property)
				this.deleteLang(lang)
			}
			this.editing = null
			console.log("deleteIfEmpty() called")
		},
	},
	computed: {
		lpairs: {
			get: function() {
				console.log('getter called')
				return this.value
			},
			set: function(value) {
				console.log('setter called with value', value)
				//this.$store.commit('updateValue', value)
				this.$store.commit('updateValue', {
					p: this.parent,
					prop: this.property,
					val: value,
				})
			},
		},
	},
	components: {
		LanguageSelect,
		Wrapper,
	},
	created() {
		//console.log("!!! i18n-string:", this, this.path, this.$props, this.$data, this.value, typeof this.value)
		//this.value['xx'] = "Language string test value"
		//this.updateValue()
		//console.log("VALUE:", this.value, this.parent)
	},
}
</script>
