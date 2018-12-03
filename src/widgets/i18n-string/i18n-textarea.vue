<template>
	<wrapper>
		<b-form-group label-cols="2" breakpoint="md" :description="uiDescription" :label="uiLabel">
			<b-tabs v-model="tabIndex" pills>
				<b-tab v-for="(val, lang, i) in languageKeysAndValues" :key="lang" :title="languages[lang]" no-body>
					<b-form-textarea
						class="textarea"
						:id="'textarea-' + lang"
						:ref="'textarea-tab-' + i"
						:lang="lang"
						:placeholder="uiPlaceholder"
						:plaintext="false"
						:rows="6"
						:max-rows="12"
						:value="val"
						@input="e => updateValue(e)">
					</b-form-textarea>
				</b-tab>

				<template slot="tabs">
					<div class="lang-select-tab">
						<language-select ref="langSelect"
							:value="newLanguage"
							@input="lang => addTab(lang)"
							@keyup.enter.native="addTab()">
						</language-select>
					</div>
				</template>
				<div slot="empty"><empty-note></empty-note></div>
			</b-tabs>
		</b-form-group>
	</wrapper>
</template>

<style lang="scss" scoped>
	.lang-select-tab {
		display: inline-flex;
	}
	.textarea {
		margin-top: 10px;
	}
</style>


<script>
import vSchemaBase from '../v-schema-base.vue'
import langCodes2 from '../../data/iso639-1.json'
import LanguageSelect from '@/components/LanguageSelect.vue'
import Wrapper from '../../components/Wrapper.vue';

export default {
	extends: vSchemaBase,
	name: 'i18n-textarea',
	description: 'a string with support for multiple languages',
	schematype: 'object',
	/*directives: {
		activate: {
			inserted: function (el, binding, vnode) {
				vnode.context.focusOnLastTab()
			}
		}
	},*/
	components: {
		LanguageSelect,
		Wrapper,
	},
	data: function() {
		return {
			newLanguage: null,
			languages: langCodes2,
			tabIndex: 0,
		}
	},
	methods: {
		addTab: function(lang) {
			console.log('add tab', lang);
			this.newLanguage = lang;
			// validate language
			const shouldNotCreateTab = !this.newLanguage ||
				this.newLanguage.length < 2 ||
				this.newLanguage.length > 3 ||
				!(this.newLanguage in this.languages)

			if (shouldNotCreateTab) {
				return true;
			}

			if (typeof this.value[this.newLanguage] === 'string') {
				console.log("tab exists already")
				this.newLanguage = null;
				this.focusOnTabWithLanguage(this.newLanguage)
				return;
			}

			this.$set(this.value, this.newLanguage, "")
			this.updateValue();
			this.focusOnLastTab();
			this.newLanguage = null;
		},
		deleteLang: function(lang) {
			this.$delete(this.value, lang);
			this.updateValue();
		},
		updateValue() {
			this.$store.commit('updateValue', {
				p: this.parent,
				prop: this.property,
				val: this.value,
			});
			//languageKeysAndValues[lang] = $event.target.value
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
		languageKeysAndValues() {
			console.log('getter called');
			return this.value;
		},
	},
}
</script>
