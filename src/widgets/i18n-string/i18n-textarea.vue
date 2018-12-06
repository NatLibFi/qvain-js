<template>
	<wrapper>
		<b-form-group label-cols="2" breakpoint="md" :description="uiDescription" :label="uiLabel">
			<b-tabs v-model="tabIndex" pills>
				<b-tab v-for="key in languageKeys" :key="key" :title="languages[key]" no-body>
					<span @click="e => deleteLang(key)"><i class="delete-icon fas fa-trash"></i></span>
					<b-form-textarea
						class="textarea"
						:id="'textarea-' + key"
						:ref="'textarea-tab-' + key"
						:placeholder="uiPlaceholder"
						:rows="6"
						:max-rows="12"
						:value="state[key]"
						@input="v => changeText(key, v)">
					</b-form-textarea>
				</b-tab>

				<template slot="tabs">
					<div>
						<language-select ref="langSelect"
							class="lang-select-tab"
							v-model="selectedLanguage"
							@keyup.enter.native="lang => selectedLanguage = lang">
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
		height: 40px;
		margin-left: 10px;
	}
	.textarea {
		margin-top: 10px;
	}
	.delete-icon {
		float: right;
		margin: 10px;
		&:hover {
			color: grey;
		}
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
	components: {
		LanguageSelect,
		Wrapper,
	},
	data: function() {
		return {
			languages: langCodes2,
			tabIndex: 0,
			selectedLanguage: null,
			state: {},
		}
	},
	computed: {
		languageKeys() {
			return Object.keys(this.value);
		}
	},
	methods: {
		changeText(key, value) {
			console.log('asd', key, value);
			this.$set(this.state, key, value);
			this.updateValue();
		},
		addTab(lang) {
			console.log('add tab: ', lang);
			if (lang in this.state) {
				this.focusOnTabWithLanguage(lang);
				return;
			}
			this.$set(this.state, lang, '');
			this.updateValue();
			this.focusOnLastTab();
		},
		deleteLang(lang) {
			console.log('asdasdasdasd', lang);
			this.$delete(this.state, lang);
			this.updateValue();
		},
		updateValue() {
			this.$store.commit('updateValue', {
				p: this.parent,
				prop: this.property,
				val: this.state,
			});
		},
		focusOnLastTab: function() {
			const last = Object.keys(this.value || {}).length - 1

			// wait for tab to appear in DOM before switching to it;
			// works for Chrome, but not Firefox
			this.$nextTick(function() {
				this.tabIndex = last;
				this.focusOnTextarea();
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
	watch: {
		selectedLanguage(lang) {
			if (!lang) {
				return;
			}
			this.addTab(lang);
		}
	},
	created() {
		this.state = this.value || {};
	}
}
</script>
