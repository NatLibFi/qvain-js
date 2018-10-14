<template>
	<div :id="domId" class="qwidget">
		<!-- ElasticSearch widget -->
		<b-form-group horizontal :label-cols="2" breakpoint="md" :description="uiDescription" :label="uiLabel">
			<!-- b-alert :show="!!error" variant="danger">error contacting reference data API server: {{ error }}</b-alert -->
			selected: {{ value }} id: {{ value.id }} identifier: {{ value.identifier }}
			<b-input-group>
				<b-form-select v-model="selected" v-if="optgroups">
					<option :value="null" disabled>{{ uiPlaceholder }}</option>
					<option v-for="(child) in noGroupItems" :key="child.id" :value="child" v-if="child !== null">{{ child.label[lang] || child.label['und'] }} [{{ child.code }}]</option>
					<optgroup v-for="(groupid) in groups" v-if="groupid !== null" :key="groupid" :label="items[groupid].group.label[lang]">
						<option v-for="(child) in items[groupid].children" :key="child.id" :value="child" v-if="child !== null">{{ child.label[lang] || child.label['und'] }} [{{ child.code }}]</option>
					</optgroup>
				</b-form-select>

				<b-form-select v-model="selected" @click="getList(esIndex, esDoctype)" v-else>
					<option :value="null" disabled>{{ placeholder }}</option>
					<option v-for="item in items" :key="item.id" :value="item" :selected="item.uri == value.identifier">{{ item.label[lang] || item.label['und'] }} [{{ item.code }}] {{ item.uri }}</option>
				</b-form-select>

				<b-input-group-append>
					<b-btn variant="danger" ref="refErrorButton" id="refdata-error-btn" v-b-tooltip.hover="error" v-if="error">
						<font-awesome-icon icon="exclamation-triangle" />
					</b-btn>
					<b-btn variant="dark" v-b-tooltip.hover="error" title="retry" v-if="error" @click="getList(esIndex, esDoctype)">
						<font-awesome-icon icon="sync" v-if="!busy" />
						<font-awesome-icon icon="sync" spin v-if="busy" />
					</b-btn>
					<b-btn variant="secondary" v-b-popover.hover="ui['help']" title="help">
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

<script>
import vSchemaBase from '../v-schema-base.vue'
import esApiClient from './es.js'

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
	extends: vSchemaBase,
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
	},
	data: function() {
		return {
			items: null,
			byId: {},
			//items: null,
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
					//console.log("jopa jopa", this.items)
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
		selected: {
			get() {
				//return this.$store.state.obj.message
				//return this.value
				if (this.value && this.value['identifier']) {
					let index = this.indexOf(this.value.identifier)
					if (index >= 0) {
						return this.items[index]
					} else {
						return this.value
					}
				}
				return null
				//return this.value || null
			},
			set(value) {
				//this.$store.commit('updateMessage', value)
				//console.log("selected:", value)
				//this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: this.items[value] })
				return
				this.$store.commit('updateValue', {
					p: this.parent,
					prop: this.property,
					val: {
						identifier: value.uri,
						pref_label: value.label,
						id: value.id,
					},
				})
			},
		},
		groups: function() {
			return this.items ? Object.keys(this.items).sort() : []
		},
		noGroupItems: function() {
			return this.items && this.items[''] && this.items[''].children
				? this.items[''].children
				: []
		},
		placeholder: function() {
			return this.ui['placeholder'] || 'Select an option:'
		},
	},
	created() {
		// if not undefined or null, use whatever we've got;
		// list only gets loaded on click now
		if (this.value) {
			//console.log("jopa jopa", this.value)
			//this.items = [this.value]
		}
		this.getList(this.esIndex, this.esDoctype)
	},
}
</script>
