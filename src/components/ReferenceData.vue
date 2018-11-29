<template>
	<b-form-group :label-cols="2" :description="uiDescription" :label="uiLabel" feedback="feedback">
		<div class="wrapper">
			<Multiselect v-if="showLang"
				v-model="selectedLang"
				:options="languages"
				label="language"
				placeholder="Language"
				class="lang-select"/>

			<Multiselect v-if="optionsShouldBeGrouped"
				class="value-select"
				v-model="selectedOptions"
				track-by="identifier"
				:internalSearch="!async"
				:loading="isLoading"
				:optionsLimit="count"
				:taggable="tags"
				:searchable="typeahead"
				:multiple="isMultiselect"
				:options="options"
				:showNoResults="true"
				:customLabel="customLabel"
				placeholder="Select option"
				group-values="children"
				group-label="pref_label"
				openDirection="below"
				@search-change="search">
				<div slot="noResult">No elements found. Consider changing the search query. You may have to type at least 3 letters.</div>
				<div v-bind:class="{ option__child: !option.$groupLabel, option__parent: option.$groupLabel }" slot="option" slot-scope="{ option }" v-if="grouped">
					{{ option.$groupLabel || customLabel(option) }}
				</div>
			</Multiselect>
			<Multiselect v-else
				class="value-select"
				v-model="selectedOptions"
				track-by="identifier"
				:internalSearch="!async"
				:loading="isLoading"
				:optionsLimit="count"
				:taggable="tags"
				:searchable="typeahead"
				:multiple="isMultiselect"
				:options="sortedOptions"
				:showNoResults="true"
				:customLabel="customLabel"
				placeholder="Select option"
				openDirection="below"
				@search-change="search">
				<div slot="noResult">No elements found. Consider changing the search query. You may have to type at least 3 letters.</div>
			</Multiselect>
		</div>
	</b-form-group>
</template>

<script>

import vSchemaBase from '../widgets/v-schema-base.vue';
import { esApiSearchClient } from '../widgets/refdata/es.js';

import Multiselect from 'vue-multiselect';

export default {
	name: 'reference-data',
	extends: vSchemaBase,
	components: {
		Multiselect
	},
	props: {
		esIndex: { type: String, required: true },
		esDoctype: { type: String, required: true },
		async: { type: Boolean, required: true },
		count: { type: Number, default: 10000 },
		typeahead: { type: Boolean, dafault: false },
		tags: { type: Boolean, default: false },
		showLang: { type: Boolean, default: false },
		grouped: { type: Boolean, required: false },
	},
	data() {
		return {
			responseData: [],
			selectedOptions: [],
			languages: [
				{ id: 'fi', language: 'Finnish' },
				{ id: 'en', language: 'English' },
				{ id: 'sv', language: 'Swedish' }
			],
			selectedLang: null,
			isLoading: false,
		}
	},
	computed: {
		currentLanguage() {
			const selectedLanguage = this.selectedLang ? this.selectedLang.id : null;
			return selectedLanguage || this.$root.language || 'en';
		},
		isMultiselect() {
			return this.schema.type === 'array';
		},
		responseHasResults() {
			return this.responseData.hits && this.responseData.hits.hits;
		},
		optionItems() {
			const items = this.responseHasResults ? this.responseData.hits.hits : [];
			return items
				.filter(this.acceptableOption)
				.map(es => es._source)
				.map(this.mapToInternalKeys);
		},
		parentItems() {
 			return this.optionItems.filter(item => item.hasChildren);
		},
		childrenItems() {
			return this.optionItems.filter(item => !item.hasChildren);
		},
		optionsShouldBeGrouped() {
			return this.grouped && this.parentItems.length > 0;
		},
		options() {
			// empty case
			if (!this.responseHasResults) {
				return [];
			}

			// case with children
			if (this.optionsShouldBeGrouped) {
				return this.parentItems.map(parent => {
					const children = this.childrenItems.filter(child => parent.children.includes(child.id));
					return { ...parent, children };
				});
			}

			// normal case
			return this.optionItems;
		},
		sortedOptions() {
			return this.options.sort((a, b) => {
				const aLabel = a.label[this.currentLanguage] || a.label['und'];
				const bLabel = b.label[this.currentLanguage] || b.label['und'];
				return aLabel.localeCompare(bLabel);
			});
		}
	},
	methods: {
		customLabel(option) {
			return option.label[this.currentLanguage] || option.label['und'];
		},
		acceptableOption(es) {
			const FILTER_FIELD = 'internal_code';
			const hasURI = (es._source && es._source.uri);
			return hasURI || es._source[FILTER_FIELD];
		},
		mapToInternalKeys(es, lang) {
			const selectedLanguage = this.selectedLang ? this.selectedLang.id : this.selectedLang;
			return {
				id: es.id,
				identifier: es.uri,
				label: es.label,
				pref_label: es.label[this.currentLanguage],
				children: es.child_ids,
				hasChildren: es.has_children
			};
		},
		async getAllReferenceData() {
			const res = await esApiSearchClient(this.esIndex, this.esDoctype, undefined, this.count);
			this.responseData = res.data;
		},
		async searchReferenceData(searchQuery) {
			const res = await esApiSearchClient(this.esIndex, this.esDoctype, searchQuery, this.count);
			this.responseData = res.data;
		},
		// TODO: if the es server is under too much stress debounce could be implemented
		async search(searchQuery) {
			if (!searchQuery) {
				return; // prevent empty search after removing characters from input
			}

			this.isLoading = true;
			if (this.async) {
				const q = this.selectedLang ?
					`label.${this.selectedLang.id}:*${searchQuery}*`:
					`*${searchQuery}*`;
				this.searchReferenceData(q);
			}
			this.isLoading = false;
		}
	},
	async created() {
		const isEmptyObject = this.value && typeof this.value === 'object' && Object.keys(this.value).length === 0;
		this.selectedOptions = isEmptyObject ? null : this.value;
		if (!this.async) {
			this.getAllReferenceData();
		}
	},
	watch: {
		selectedOptions(e) {
			this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: e });
		}
	}
}
</script>
<style lang="scss" scoped>
.wrapper {
	width: 100%;
	display: inline-flex;

	.lang-select {
		width: 300px;
		padding-right: 5px;
	}
	.value-select {
		flex-grow: 1;
	}
}

.option__child {
	padding-left: 20px;
}
.option__parent {
	font-weight: bold;
    color: black !important;
}
</style>
