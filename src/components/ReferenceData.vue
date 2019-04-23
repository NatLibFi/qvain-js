<template>
	<record-field :required="required" :wrapped="wrapped">
		<title-component slot="title" :title="uiLabel" />
		<div slot="header-right" class="header__right">
			<!--<ValidationStatus :status="validationStatus" />-->
			<InfoIcon :description="uiDescription"/>
		</div>

		<div slot="input">
			<div class="input-row__inline">
				<Multiselect v-if="showLang"
					v-model="selectedLang"
					:options="languages"
					:placeholder="placeholder"
					label="language"
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
					:placeholder="placeholder"
					group-values="children"
					:group-label="labelNameInSchema"
					@search-change="search">
					<div slot="noResult">No elements found. Consider changing the search query. You may have to type at least 3 letters.</div>
					<div v-bind:class="{ option__child: !option.$groupLabel, option__parent: option.$groupLabel }" slot="option" slot-scope="{ option }" v-if="grouped">
						{{ option.$groupLabel || customLabel(option) }}
					</div>
					<div v-if="selectedOptions.length > 0" slot="selection">{{placeholder}}</div>
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
					:clearOnSelect="false"
					:options="sortedOptions"
					:showNoResults="true"
					:customLabel="customLabel"
					:placeholder="placeholder"
					@select="atSelect"
					@search-change="search">
					<div slot="noResult">No elements found. Consider changing the search query. You may have to type at least 3 letters.</div>
					<div slot="selection" slot-scope="{ values, search, isOpen }">
						<span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">{{ placeholder }} options selected</span>
					</div>
				</Multiselect>
			</div>
			<div v-if="isMultiselect" class="tag__list">
				<p v-for="(option, index) in Array.from(selectedOptions)" :key="option.identifier" class="tag">
					{{customLabel(option)}}
					<span class="remove-button">
						<DeleteButton @click="removeValue(index)" />
					</span>
				</p>
			</div>
			<div v-if="!isMultiselect && !Array.isArray(selectedOptions)" class="tag__list">
				<p class="tag">
					{{customLabel(selectedOptions)}}
					<span class="remove-button">
						<DeleteButton @click="removeValue(-1)" />
					</span>
				</p>
			</div>
		</div>
	</record-field>
</template>

<script>
import vSchemaBase from '@/widgets/base.vue'
import { esApiSearchClient } from '@/widgets/refdata/es.js'
import DeleteButton from '@/partials/DeleteButton.vue'
import Multiselect from 'vue-multiselect'
import RecordField from '@/composites/RecordField.vue'
import TitleComponent from '@/partials/Title.vue'
import InfoIcon from '@/partials/InfoIcon.vue'

export default {
	name: 'reference-data',
	extends: vSchemaBase,
	components: {
		Multiselect,
		DeleteButton,
		RecordField,
		TitleComponent,
		InfoIcon,
	},
	props: {
		esIndex: { type: String, required: true },
		esDoctype: { type: String, required: true },
		async: { type: Boolean, required: true },
		count: { type: Number, default: 10000 },
		typeahead: { type: Boolean, dafault: false },
		tags: { type: Boolean, default: false },
		showLang: { type: Boolean, default: false },
		wrapped: { type: Boolean, default: false },
		labelNameInSchema: { type: String, default: 'pref_label' },
		grouped: { type: Boolean, required: false },
	},
	data() {
		return {
			responseData: {},
			selectedOptions: [],
			languages: [
				{ id: 'fi', language: 'Finnish' },
				{ id: 'en', language: 'English' },
				{ id: 'sv', language: 'Swedish' },
			],
			selectedLang: null,
			isLoading: false,
		}
	},
	computed: {
		placeholder() {
			return this.async ?
				'Type to search for available options' :
				'Select option'
		},
		currentLanguage() {
			const selectedLanguage = this.selectedLang ? this.selectedLang.id : null
			return selectedLanguage || this.$root.language || 'en'
		},
		isMultiselect() {
			return this.schema.type === 'array'
		},
		responseHasResults() {
			return this.responseData.hits && this.responseData.hits.hits
		},
		optionItems() {
			const items = this.responseHasResults ? this.responseData.hits.hits : []
			return items
				.filter(this.acceptableOption)
				.map(es => es._source)
				.map(this.mapToInternalKeys)
		},
		parentItems() {
			return this.optionItems.filter(item => item.hasChildren)
		},
		childrenItems() {
			return this.optionItems.filter(item => !item.hasChildren)
		},
		optionsShouldBeGrouped() {
			return this.grouped && this.parentItems.length > 0
		},
		options() {
			// empty case
			if (!this.responseHasResults) {
				return []
			}

			// case with children
			if (this.optionsShouldBeGrouped) {
				return this.parentItems.map(parent => {
					const children = this.childrenItems.filter(child => parent.children.includes(child.id))
					return { ...parent, children }
				})
			}

			// normal case
			return this.optionItems
		},
		sortedOptions() {
			return this.options.sort((a, b) => {
				const aLabel = a.label[this.currentLanguage] || a.label['und']
				const bLabel = b.label[this.currentLanguage] || b.label['und']
				return aLabel.localeCompare(bLabel)
			})
		},
		isEmptyObject() {
			return this.value &&
				typeof this.value === 'object' && Object.keys(this.value).length === 0
		},
		isArray() {
			return this.value && this.value.length > 0
		},
	},
	methods: {
		customLabel(option) {
			if (option === null) {
				return option
			}

			return option.label ? option.label[this.currentLanguage] || option.label['und'] : null
		},
		acceptableOption(es) {
			const FILTER_FIELD = 'internal_code'
			const hasURI = (es._source && es._source.uri)
			return hasURI || es._source[FILTER_FIELD]
		},
		mapToInternalKeys(es) {
			return {
				id: es.id,
				identifier: es.uri,
				[this.labelNameInSchema]: es.label[this.currentLanguage],
				label: es.label,
				children: es.child_ids,
				hasChildren: es.has_children,
			}
		},
		async getAllReferenceData() {
			const res = await esApiSearchClient(this.esIndex, this.esDoctype, undefined, this.count)
			this.responseData = res.data
		},
		async searchReferenceData(searchQuery) {
			const res = await esApiSearchClient(this.esIndex, this.esDoctype, searchQuery, this.count)
			this.responseData = res.data
		},
		// TODO: if the es server is under too much stress debounce could be implemented
		async search(searchQuery) {
			if (!searchQuery) {
				return // prevent empty search after removing characters from input
			}

			this.isLoading = true
			if (this.async) {
				const q = this.selectedLang ?
					`label.${this.selectedLang.id}:*${searchQuery}*`:
					`*${searchQuery}*`
				this.searchReferenceData(q)
			}
			this.isLoading = false
		},
		removeValue(index) {
			if (index === -1) {
				this.selectedOptions = null
			} else {
				this.selectedOptions.splice(index, 1)
			}
		},
		atSelect() {
			if (this.async) {
				this.responseData = {}
			}
		},
	},
	async created() {
		if (this.isMultiselect && this.isArray) {
			this.selectedOptions = this.value.map(v => ({ identifier: v.identifier, label: v[this.labelNameInSchema] }))
		}

		if (!this.isMultiselect && !this.isEmptyObject) {
			if (!this.value.identifier) {
				this.selectedOptions = null
			} else {
				const { identifier } = this.value
				const label = this.value[this.labelNameInSchema]
				this.selectedOptions = { identifier, label }
			}
		}

		if (!this.async) {
			this.getAllReferenceData()
		}
	},
	watch: {
		selectedOptions() {
			const selectedValueIsSet = this.selectedOptions !== null && typeof this.selectedOptions !== 'undefined'

			const mapToStore = option => {
				if (typeof option === 'undefined') {
					return option
				}

				const { identifier, label: { sv, en, fi, und } } = option
				return { identifier, [this.labelNameInSchema]: { sv, en, fi, und } }
			}

			let storableOptions
			if (this.isMultiselect && selectedValueIsSet) {
				storableOptions = this.selectedOptions.map(mapToStore)
			}

			if (!this.isMultiselect && selectedValueIsSet) {
				storableOptions = mapToStore(this.selectedOptions)
			}

			storableOptions && this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: storableOptions })
		},
	},
}
</script>
<style lang="scss" scoped>
.input-row__inline {
	width: 100%;
	display: inline-flex;
	margin-bottom: 5px;

	.lang-select {
		width: 300px;
		padding-right: 5px;
	}
	.value-select {
		flex-grow: 1;
	}
}

.tag {
	color: white;
	background: #007fad;
	border-radius: 5px;

	padding-left: 5px;
	margin-bottom: 0px;
    margin-right: 10px;
}
.tag__list {
	display: inline-flex;
}
.remove-button {
	vertical-align: top;
}

.option__child {
	padding-left: 20px;
}
.option__parent {
	font-weight: bold;
    color: black !important;
}
</style>

<style lang="scss">
.multiselect__option--highlight,
.multiselect__option--highlight:after,
.multiselect__tag {
	background: $fd-primary;
}

.multiselect__spinner:before,
.multiselect__spinner:after {
	border-color: $fd-primary transparent transparent;
}

.multiselect__tag-icon:after {
	color: $fd-primary-black;
}

.multiselect__tag-icon:focus,
.multiselect__tag-icon:hover {
	background: $fd-primary-dark;
}

.multiselect__option--selected.multiselect__option--highlight {
	background: $danger;
}

.multiselect__option--selected.multiselect__option--highlight:after {
	background: $danger;
}

.multiselect__tags {
	border: 0;
	border-radius: 0;
	border-bottom: solid 1px lightgray;
	height: 40px;
}
</style>
