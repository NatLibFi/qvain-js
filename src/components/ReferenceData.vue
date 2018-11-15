<template>
	<b-form-group :label-cols="2" :description="uiDescription" :label="uiLabel" feedback="feedback">
		<Multiselect v-if="parentItems.length > 0"
			v-model="selectedOptions"
			track-by="identifier"
			:internalSearch="!async"
			:loading="isLoading"
			:optionsLimit="count"
			:taggable="tags"
			:searchable="typeahead"
			:multiple="multiselect"
			:options="options"
			:showNoResults="true"
			placeholder="Select option - you may have to type at least 3 letters"
			label="pref_label"
			group-values="children"
			group-label="pref_label"
			openDirection="below"
			@search-change="search">
			<div slot="noResult">No elements found. Consider changing the search query. You may have to type at least 3 letters.</div>
		</Multiselect>
		<Multiselect v-else
			v-model="selectedOptions"
			track-by="identifier"
			:internalSearch="!async"
			:loading="isLoading"
			:optionsLimit="count"
			:taggable="tags"
			:searchable="typeahead"
			:multiple="multiselect"
			:options="options"
			:showNoResults="true"
			placeholder="Select option - you may have to type at least 3 letters"
			label="pref_label"
			openDirection="below"
			@search-change="search">
			<div slot="noResult">No elements found. Consider changing the search query. You may have to type at least 3 letters.</div>
		</Multiselect>
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
		multiselect: { type: Boolean, default: false }
	},
	data() {
		return {
			responseData: [],
			selectedOptions: [],
			isLoading: false,
		}
	},
	computed: {
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
		options() {
			// empty case
			if (!this.responseHasResults) {
				return [];
			}

			// case with children
			if (this.parentItems.length > 0) {
				return this.parentItems.map(parent => {
					const children = this.childrenItems.filter(child => parent.children.includes(child.id));
					return { ...parent, children };
				});
			}

			// normal case
			return this.optionItems;
		}
	},
	methods: {
		acceptableOption(es) {
			const FILTER_FIELD = 'internal_code';
			const hasURI = (es._source && es._source.uri);
			return hasURI || es._source[FILTER_FIELD];
		},
		mapToInternalKeys(es) {
			return {
				id: es.id,
				identifier: es.uri,
				pref_label: es.label[this.$root.language || 'en'],
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
				return;  // prevent empty search after removing characters from input
			}

			this.isLoading = true;
			if (this.async) {
				this.searchReferenceData(searchQuery)
			}
			this.isLoading = false;
		}
	},
	async created() {
		this.selectedOptions = this.value;
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


