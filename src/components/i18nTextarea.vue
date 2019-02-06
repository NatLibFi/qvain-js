<template>
	<record-field :required="true" :wrapped="true">
		<title-component slot="title" :title="uiLabel" />
		<div slot="header-right" class="header__right">
			<ValidationStatus :status="validationStatus" />
			<InfoIcon :description="uiDescription"/>
		</div>

		<div slot="input">
			<b-tabs class="tabs-nav" v-model="tabIndex" pills>
				<b-tab v-for="key in languageKeys" :key="key" no-body>
					<template slot="title">
						{{ languages[key] }}
						<font-awesome-icon icon="times" @click="deleteLang(key)" />
					</template>

					<b-form-textarea
						class="textarea"
						placeholder="Start typing!"
						:value="state[key]"
						:id="'textarea-' + key"
						:ref="'textarea-tab-' + key"
						@input="v => changeText(key, v)">
					</b-form-textarea>
				</b-tab>

				<template slot="tabs" v-if="languageKeys.length > 0">
					<div> <!-- this div makes the tab stay on first line -->
						<language-select ref="langSelect"
							class="lang-select-tab"
							v-model="selectedLanguage"
							@keyup.enter.native="lang => selectedLanguage = lang">
						</language-select>
					</div>
				</template>

				<div slot="empty">
					<p class="intro-text">
						Start by selecting the language. You may add as many languages as you wish by clicking them from the dropdown below.
					</p>
					<div class="language-row">
						<language-select class="input-width" @change="addTab" />
					</div>
				</div>
			</b-tabs>
		</div>
	</record-field>
</template>

<style lang="scss" scoped>
.lang-select-tab {
	height: 40px;
	margin-left: 10px;
}
.textarea {
	min-height: 100px;
	overflow: hidden;
	resize: none;
    background-image: linear-gradient(white, white 30px, #ccc 30px, #ccc 31px, white 31px);
    background-size: 100% 31px;
    border: 0px solid #ccc;
    border-radius: 8px;
    line-height: 31px;
    font-family: Arial, Helvetica, Sans-serif;
    padding: 8px;
}
.delete-icon {
	float: right;
	margin: 10px;
	&:hover {
		color: grey;
	}
}
.tabs-nav .nav-item .nav-link {
	height: 38px;
}
.intro-text {
	text-align: center;
}
.language-row {
	display: inline-flex;
	justify-content: space-around;
	width: 100%;
	border: 0;

	.input-width {
		width: 220px;
	}
}

</style>


<script>
import vSchemaBase from '@/widgets/base.vue';
import langCodes2 from '@/data/iso639-1.json';
import LanguageSelect from '@/components/LanguageSelect.vue';
import ValidationStatus from '@/partials/ValidationStatus.vue';
import RecordField from '@/composites/RecordField.vue';
import TitleComponent from '@/partials/Title.vue';
import InfoIcon from '@/partials/InfoIcon.vue';

import autosize from 'autosize';

export default {
	extends: vSchemaBase,
	name: 'i18n-textarea',
	description: 'a string with support for multiple languages',
	schematype: 'object',
	components: {
		LanguageSelect,
		ValidationStatus,
		RecordField,
		TitleComponent,
		InfoIcon
	},
	data() {
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
		},
		hasEmptyValues() {
			return Object.values(this.state).some(v => v.length == 0);
		},
		validationStatus() {
			if (this.schemaState && this.hasEmptyValues) return 'uncertain';
			if (this.schemaState) return 'valid';
			if (this.schemaState !== null && !this.schemaState) return 'invalid';
			return null;
		}
	},
	methods: {
		changeText(key, value) {
			const el = this.$refs['textarea-tab-' + key][0].$el;
			autosize(el);

			this.$set(this.state, key, value);
			this.updateValue();
		},
		addTab(lang) {
			if (lang in this.state) {
				this.focusOnTabWithLanguage(lang);
				return;
			}
			this.$set(this.state, lang, '');
			this.updateValue();
			this.focusOnLastTab();
		},
		deleteLang(lang) {
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
