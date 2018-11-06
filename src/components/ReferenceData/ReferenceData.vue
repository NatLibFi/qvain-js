<template>
	<b-form-group horizontal :label-cols="2" :description="uiDescription" :label="uiLabel" feedback="feedback">
		<Multiselect v-model="selectedOptions"
			track-by="identifier"
			:internalSearch="false"
			:loading="isLoading"
			:optionsLimit="20"
			:taggable="tags"
			:searchable="typeahead"
			:multiple="multiselect"
			:options="options"
			placeholder="Select option - you may have to type at least 3 letters"
			label="pref_label"
			openDirection="below"
			@search-change="search">
		</Multiselect>
	</b-form-group>
</template>

<script>

import vSchemaBase from '../../widgets/v-schema-base.vue';
import { esApiSearchClient } from '../../widgets/refdata/es.js';

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
		typeahead: { type: Boolean, dafault: false },
		tags: { type: Boolean, default: false },
		multiselect: { type: Boolean, default: false }
	},
	data() {
		return {
			options: [],
			selectedOptions: [],
			isLoading: false,
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
				identifier: es.uri,
				secondary: es.code || es.id || null,
				pref_label: es.label[this.$root.language || 'en']
			};
		},
		async search(searchQuery) {
			// TODO: if the es server is under too much stress debounce could be implemented
			if (searchQuery) {
				this.isLoading = true;
				const res = await esApiSearchClient(this.esIndex, this.esDoctype, searchQuery || '');
				if (res.data.hits && res.data.hits.hits) {
					this.options = res.data.hits.hits
						.filter(this.acceptableOption)
						.map(es => es._source)
						.map(this.mapToInternalKeys);
					this.isLoading = false;
				}
			} else {
				this.options = [];
			}
		}
	},
	async created() {
		this.selectedOptions = this.value;
		await this.search('a'); // by default have some data in menu
	},
	watch: {
		selectedOptions(e) {
			this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: e });
		}
	}
}
</script>


