<template>
  <div row>
    <!-- ElasticSearch widget -->
    <b-form-group id="fundertype-form-group" horizontal :label-cols="uiLabel ? labelCols : 1" :description="uiDescription" :label="uiLabel">
      <!-- b-alert :show="!!error" variant="danger">error contacting reference data API server: {{ error }}</b-alert -->
      <b-input-group>
        <!-- <b-form-select :value="value" @change="setValue" v-if="optgroups">
          <option :value="null" disabled>{{ uiPlaceholder }}</option>
          <option v-for="(child, childIndex) in noGroupItems" :key="child.id" :value="child" v-if="child !== null">{{ child.label[lang] || child.label['und'] }} [{{ child.code }}]</option>
          <optgroup v-for="(groupid, index) in groups" v-if="groupid !== null" :key="groupid" :label="items[groupid].group.label[lang]">
            <option v-for="(child, childIndex) in items[groupid].children" :key="child.id" :value="child" v-if="child !== null">{{ child.label[lang] || child.label['und'] }} [{{ child.code }}]</option>
          </optgroup>
        </b-form-select> -->
        <div v-if="type === 'multiselect'" class="flex-grow-1">
          <Multiselect v-model="model" @input="setValue" :options="items" v-if="items" :customLabel="customLabel"
            :optionsLimit="40" :allowEmpty="!isRequired" :showLabels="false" />
        </div>
        <b-input-group-append>
          <b-btn variant="danger" ref="refErrorButton" id="refdata-error-btn" v-b-tooltip.hover="error" v-if="error">
            <font-awesome-icon icon="exclamation-triangle" />
          </b-btn>
          <b-btn variant="dark" v-b-tooltip.hover="error" title="retry" v-if="error" @click="getList(esIndex, esDoctype)">
            <font-awesome-icon icon="sync" />
            <font-awesome-icon icon="sync" spin v-if="busy" />
          </b-btn>
          <b-btn variant="secondary" v-b-popover.hover="help" title="help" v-if="help" class="rounded-right">
            <font-awesome-icon icon="question-circle" />
          </b-btn>
        </b-input-group-append>
        <b-popover target="refdata-error-btn" triggers="hover click" class="error-popover">
          <template slot="title">
            <b-btn variant="dark">
              <font-awesome-icon icon="sync" />
            </b-btn>
            <b-btn class="close" aria-label="Close">
              <span class="d-inline-block" aria-hidden="true">&times;</span>
            </b-btn>
            Error
          </template>
          <b-alert variant="danger" show>
            {{ error }}
          </b-alert>
        </b-popover>
      </b-input-group>
    </b-form-group>
  </div>
</template>

<style>
.popover {
  color: red;
}
.error-popover {
  background-color: red;
}
</style>

<script>
import vSchemaBase from '../base.vue'
import esApiClient from './es.js'
import Multiselect from 'vue-multiselect'

function groupByParent(objectArray) {
	let grouped = objectArray.reduce(function(acc, obj) {
		if (!obj['_source']) return acc

		// get rid of the annoying _source level
		obj = obj['_source']

		// if a value doesn't have parent_ids, add it to empty key
		let targets = obj['parent_ids'] || ['']

		// group top categories with their children
		if (targets.length < 1) {
			targets = obj['has_children'] ? [obj.id] : ['']
		}

		for (let key of targets) {
			if (!acc[key]) {
				acc[key] = { group: null, children: [] }
			}
			if (obj.id === key) {
				// group item
				acc[key].group = obj
			} else {
				// child item
				acc[key].children.push(obj)
			}
		}
		return acc
	}, {})

	// pre-sort children
	Object.keys(grouped).forEach(group => grouped[group].children.sort(sortById))

	return grouped
}

const sortById = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)

function filterKeys(full, wanted) {
	return Object.keys(full)
		.filter(key => wanted.includes(key))
		.reduce((obj, key) => {
			obj[key] = full[key]
			return obj
		}, {})
}

export default {
	name: 'refdata-list',
	description: 'refdata list from Elastic Search',
	schematype: 'object',
	props: {
		esIndex: {
			default: 'reference_data',
			type: String,
		},
		esDoctype: {
			default: 'funder_type', // funder_type, license
			type: String,
		},
		optgroups: {
			default: false,
			type: Boolean,
		},
		uiDescription: {
			type: String,
		},
		uiPlaceholder: {
			type: String,
		},
		uiLabel: {
			type: String,
		},
		placeholder: {
			type: String,
		},
		help: { type: String },
		labelCols: {
			default: '3',
			type: String,
		},
		customLabel: { type: Function },
		isRequired: { type: Boolean },
		setValue: { required: true, type: Function },
		value: { required: true },
		type: { type: String },
	},
	data: function() {
		return {
			items: null,
			model: null,
			error: null,
			busy: false,
			filterApiFields: true,
			lang: 'en',
			apiFields: ['code', 'id', 'label', 'type', 'uri'],
		}
	},
	methods: {
		getList: function(index, doctype) {
			this.busy = true
			let vm = this
			esApiClient(index, doctype)
				.then(response => {
					console.log('response', response)
					if (response.data && response.data.hits && response.data.hits.hits) {
						if (this.optgroups) {
							vm.items = groupByParent(response.data.hits.hits)
						} else {
							let items = response.data.hits.hits
							vm.items = vm.filterApiFields
								? items.map(item => filterKeys(item['_source'], vm.apiFields))
								: items.map(item => item['_source'])
						}
						vm.error = null
					} else {
						vm.items = []
						vm.error = 'no data'
					}
				})
				.catch(error => {
					console.log(error)
					this.error = 'error calling ElasticSearch API'
					console.log(Object.keys(error))
					if (error.response && error.response.status) {
						this.error += ': ' + error.response.status + (error.response.statusText ? '(' + error.response.statusText + ')' : '')
					}
				})
				// "finally() is not a function" :(
				.then(() => {
					vm.busy = false
				})
		},
		indexOf: function(id) {
			if (!this.items) {
				return -1
			}
			for (let i = 0; i < this.items.length; i++) {
				if (this.items['id'] === id) {
					return i
				}
			}
			return -1
		},
	},
	computed: {
		groups: function() {
			return this.items ? Object.keys(this.items).sort() : []
		},
		noGroupItems: function() {
			return this.items && this.items[''] && this.items[''].children
				? this.items[''].children
				: []
		},
	},
	created() {
		//console.log("refdata widget", this.value)
		//this.getList("reference_data", "funder_type")
		console.log('list item created')
		this.model = this.value
		this.getList(this.esIndex, this.esDoctype)
	},
	components: {
		Multiselect,
	},
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
.input-group {
  flex-wrap: nowrap;
}
</style>
