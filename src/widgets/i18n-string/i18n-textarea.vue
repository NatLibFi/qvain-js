<template>
	<div :id="domId" class="qwidget">
		<!-- i18n-textarea -->
		<b-form-group label-cols="2" breakpoint="md" :description="uiDescription" :label="uiLabel">
			<b-card no-body flush style="border: 0;">
				<span v-if="false">TEXTAREA editing: {{ editing }} editingInput: {{ editingInput }} tabIndex {{ tabIndex }}</span>
				<b-tabs v-model="tabIndex" pills card><!-- pills end card -->
					<b-tab v-for="(val, lang, i) in lpairs" :key="lang" :title="lang" no-body>
						<b-card>
							<h5>{{ languages[lang] || lang }}
								<div class="p-0 m-0 float-right">
									<b-btn class="btn btn-outline-secondary" style="border: 0;" @click="resetEditing(lang, $event)" v-show="editing == lang"><font-awesome-icon icon="undo" fixed-width /></b-btn>
									<b-btn class="btn btn-outline-danger" style="border: 0;" @click="deleteLang(lang)"><font-awesome-icon icon="trash" fixed-width class="text-dark" /></b-btn>
								</div>
							</h5>
							<b-form-textarea :id="domId + '-textarea-' + lang" :ref="'textarea-tab-' + i" :lang="lang" :value="editing == lang ? editingInput : val" :placeholder="uiPlaceholder" :plaintext="false" :rows="6" :max-rows="12" @input.native="editingInput = $event.target.value" @keyup.esc.native="resetEditing(lang, $event)" @blur.native="stopEditing(lang)" @click.native="startEditing(lang)" @focus.native="startEditing(lang)"></b-form-textarea>
						</b-card>
					</b-tab>
					<template slot="tabs" v-if="false">
						<b-nav-item href="#" class="float-right" style="display: block; float: right; padding-left: 5rem;" @click="()=>{}">Another tab</b-nav-item>
						<language-select class="w-25" ref="langSelect" v-model="newLanguage" :state="langState" @change.native="resetState()" @blur.native="resetState()" @focus.native="resetState()" @keyup.enter.native="addTab()"></language-select>
					</template>
					<div slot="empty"><empty-note></empty-note></div>
				</b-tabs>

				<b-card-footer>
					<b-container fluid>
						<b-row>
							<b-col cols="9" class="mr-3 p-0">
							</b-col>
							<b-col class="mr-3 p-0">
								<b-form-input size="3" maxlength="3" :id="domId + '-string-newlang'" type="text" name="i18n-string-newlang" placeholder="language" v-model="newLanguage" :state="langState" @input="resetState()" v-if="freeform" autofocus></b-form-input>
								<language-select ref="langSelect" v-model="newLanguage" :state="langState" @change.native="resetState()" @blur.native="resetState()" @focus.native="resetState()" @keyup.enter.native="addTab()" v-else></language-select>
							</b-col>
							<b-btn @click="addTab()" variant="primary">
								<font-awesome-icon icon="plus" fixed-width />
							</b-btn>
						</b-row>
					</b-container>
				</b-card-footer>
			</b-card>
		</b-form-group>
	</div>
</template>

<script>
import vSchemaBase from '../base.vue'
import langCodes2 from '../../data/iso639-1.json'
import LanguageSelect from '@/components/LanguageSelect.vue'

export default {
	extends: vSchemaBase,
	name: 'i18n-textarea',
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
			newLanguage: null,
			pairs: {
				en: 'English title for the dataset',
				nl: 'Nederlandse titel voor de dataset',
			},
			languages: langCodes2,
			feedback: '',
			state: null,
			langState: null,
			htmlTag: this.isTitle ? 'h5' : 'span',
			editing: null,
			editingInput: null,
			editingInputs: {},
			tabIndex: 0,
		}
	},
	methods: {
		debug: function(a, b, c) {
			console.log("event:", a, b, c)
		},
		blur: function() {
			this.resetState()
			this.$nextTick(function() {
				this.resetState()
			})
		},
		addTab: function() {
			// validate language
			if (
				!this.newLanguage || (this.freeform && (this.newLanguage.length < 2 || this.newLanguage.length > 3)) || (!this.freeform && !(this.newLanguage in this.languages))
			) {
				this.langState = false
			}
			// if invalid, quit
			if (this.langState === false) { return }

			if (typeof this.value[this.newLanguage] === 'string') {
				console.log("tab exists already")
				this.focusOnTabWithLanguage(this.newLanguage)
				return
			}
			this.$set(this.value, this.newLanguage, "")
			//this.value[this.newLanguage] = ""
			this.updateValue()
			this.resetState()
			this.focusOnLastTab()
			//this.focusOnTabWithLanguage(this.newLanguage)
			this.newLanguage = null
		},
		deleteLang: function(lang) {
			this.$delete(this.value, lang)
			this.updateValue()
		},
		resetState: function() {
			console.log("resetState called")
			this.langState = null
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
		setFromInput: function(lang) {
			this.$store.commit('updateValue', {
				p: this.value,
				prop: lang,
				val: this.editingInput,
			})
		},
		startEditing: function(lang) {
			console.log("startEditing() fired")

			// don't run this twice so the value doesn't get reset accidently
			if (this.editing == lang) { return }

			this.editingInput = this.value[lang] || ""
			this.editing = lang
		},
		stopEditing: function(lang) {
			console.log("stopEditing() fired")

			// don't run on invalid input if we somehow get out of sync
			if (this.editing !== lang) { return this.resetEditing() }

			if (!this.editingInput || this.editingInput.length < 1) {
				console.log("deleting empty input for language", lang)
				this.deleteLang(lang)
			} else {
				this.setFromInput(lang)
				/*
				this.$store.commit('updateValue', {
					p: this.value,
					prop: lang,
					val: this.editingInput,
				})
				*/
			}
			this.resetEditing()
		},
		resetEditing: function(lang, event) {
			console.log("resetEditing() fired", lang, event)

			if (!this.value[this.editing]) {
				this.deleteLang(this.editing)
			}
			this.editing = null
			this.editingInput = null
			//event && event.target && event.target.blur()
			this.$refs.langSelect.$el.focus()
		},
		deleteIfEmpty: function(e, lang) {
			if (this.value === undefined || this.value.length < 1) {
				//this.$parent.$emit('delete', this.property)
				this.deleteLang(lang)
			}
			this.editing = null
			console.log("deleteIfEmpty() called")
		},
		focusOnLastTab: function() {
			const last = Object.keys(this.value || {}).length - 1

			// wait for tab to appear in DOM before switching to it;
			// works for Chrome, but not Firefox
			this.$nextTick(function() {
				this.tabIndex = last
				this.focusOnTextarea()
			})

			// In Firefox, for some reason, $nextTick only ever fires before the tab gets added,
			// no matter how many times it gets called. So check again after a short delay.
			setTimeout(() => {
				if (this.tabIndex !== last) {
					console.warn("setTimeout(): retry tab switch from", this.tabIndex, "to", last)
					this.tabIndex = last
					this.focusOnTextarea()
				}
			}, 300)
		},
		focusOnTabWithLanguage(lang) {
			const i = Object.keys(this.value || {}).indexOf(lang)
			if (i >= 0) {
				// use $nextTick so this (hopefully) also works when adding a new tab that might not be in the DOM immediately
				this.$nextTick(function() {
					this.tabIndex = i
				})
				return true
			}
			return false
		},
		focusOnTextarea() {
			// this gets called after switching tabs, so try to make sure the DOM updated
			this.$nextTick(() => {
				let ref = this.$refs['textarea-tab-' + this.tabIndex]
				if (Array.isArray(ref)) {
					ref = ref[0]
				}
				ref && ref.$el && ref.$el.focus()
			})
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
	directives: {
		activate: {
			inserted: function (el, binding, vnode) {
				vnode.context.focusOnLastTab()
			}
		}
	},
	components: {
		LanguageSelect,
	},
	created() {
	},
}
</script>
