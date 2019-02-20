<template>
	<record-field :required="true" :wrapped="true">
		<title-component slot="title" :title="uiLabel" />
		<div slot="header-right" class="header__right">
			<ValidationStatus :status="validationStatus" />
			<InfoIcon :description="uiDescription"/>
		</div>

		<div slot="input">
			<b-input-group v-for="(val, lang) in state" :key="lang">
				<div class="input-group__prepend" slot="prepend">
					<p class="input-group__language text-dark font-italic">{{ languages[lang] }}</p>
				</div>
				<b-form-input type="text" :ref="lang" class="text-field" :placeholder="uiPlaceholder" v-model="state[lang]" />
				<b-input-group slot="append">
					<span class="remove-button">
						<DeleteButton @click="deleteLanguage(lang)"/>
					</span>
				</b-input-group>
			</b-input-group>

			<p class="intro-text" v-if="Object.keys(state).length === 0">
				Start by selecting the language. You may add as many languages as you wish by clicking them from the dropdown below.
			</p>
			<div class="language-row">
				<language-select class="input-width" @change="addPair" />
			</div>
		</div>
	</record-field>
</template>


<style lang="scss" scoped>
.remove-button {
	padding: 10px;
    padding-left: 2px;
}
.intro-text {
	text-align: center;
	margin: 0;
}
.language-row {
	display: inline-flex;
	justify-content: space-around;
	width: 100%;
	border: 0;
	margin-top: 10px;

	.input-width {
		width: 220px;
	}
}
.input-group__prepend {
	width: 150px;
	.input-group__language {
		line-height: 38px;
		margin: 0;
	}
}
.text-field {
	border-top: 0;
	border-left: 0;
	border-right: 0;
}
</style>

<script>

import languages from '../data/iso639-1.json';
import vSchemaBase from '@/widgets/base.vue';
import LanguageSelect from '@/components/LanguageSelect.vue';
import DeleteButton from '@/partials/DeleteButton.vue';
import ValidationStatus from '@/partials/ValidationStatus.vue';
import RecordField from '@/composites/RecordField.vue';
import TitleComponent from '@/partials/Title.vue';
import InfoIcon from '@/partials/InfoIcon.vue';

export default {
	extends: vSchemaBase,
	name: 'i18n-string',
	description: 'a string with support for multiple languages',
	schematype: 'object',
	components: {
		LanguageSelect,
		DeleteButton,
		ValidationStatus,
		RecordField,
		TitleComponent,
		InfoIcon
	},
	data() {
		return {
			state: {},
			languages: languages,
		}
	},
	methods: {
		addPair(lang) {
			if (!lang || lang in this.state) return;
			this.$set(this.state, lang, '');
			// wait for rendering so that the ref is present in dom before focus
			this.$nextTick(() => this.$refs[lang][0].$el.focus());
		},
		deleteLanguage(lang) {
			this.$delete(this.state, lang);
		},
		updateValue() {
			this.$store.commit('updateValue', {
				p: this.parent,
				prop: this.property,
				val: this.state
			});
		},
	},
	computed: {
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
	watch: {
		state(newState, oldState) {
			const shouldClearValidation = Object.keys(newState).length < Object.keys(oldState).length;
			this.updateValue();
			if (shouldClearValidation) {
				this.$store.commit('cleanStateFor', this.path);
			}
		}
	},
	created() {
		this.state = this.value;
	},
	mounted() {
		console.log('parent schema:', this.$parent.$parent.schema);
	}
}
</script>
