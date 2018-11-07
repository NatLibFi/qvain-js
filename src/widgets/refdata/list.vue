<template>
	<div :id="domId" class="qwidget">
		<!-- ElasticSearch widget -->
		<b-form-group :label-cols="2" breakpoint="md" :description="uiDescription" :label="uiLabel">
			<!-- b-alert :show="!!error" variant="danger">error contacting reference data API server: {{ error }}</b-alert -->
			selected: {{ value }} id: {{ value.id }} identifier: {{ value.identifier }}
			<p>selected2: {{ selected2 }}</p>
			<b-input-group>
				<b-input readonly :value="this.value.pref_label[lang] || this.value.pref_label['und'] || this.value.identifier"></b-input>
				<b-input-group-append>
					<b-btn>
						<font-awesome-icon icon="pen"/>
					</b-btn>
				</b-input-group-append>
			</b-input-group>

			<b-input-group>
				<b-form-select v-model="selected" v-if="optgroups">
					<option :value="null" disabled>{{ uiPlaceholder }}</option>
					<option v-for="(child) in noGroupItems" :key="child.id" :value="child" v-if="child !== null">{{ child.pref_label[lang] || child.pref_label['und'] }}{{ child.secondary ? " [" + child.secondary + "]" : ""}}</option>
					<optgroup v-for="(groupid) in groups" v-if="groupid !== null" :key="groupid" :label="apiValues[groupid].group.label[lang]">
					<option v-for="(child) in apiValues[groupid].children" :key="child.id" :value="child" v-if="child !== null">{{ child.pref_label[lang] || child.pref_label['und'] }}{{ child.secondary ? " [" + child.secondary + "]" : ""}}</option>
					</optgroup>
				</b-form-select>

				<b-form-select v-model="selected2" @focus.native="getList(esIndex, esDoctype)" v-else>
					<option :value="null" disabled>{{ placeholder }}</option> <!-- :selected="item.uri == value.identifier" -->
					<option v-for="item in apiValues" :key="item.identifier" :value="item">{{ item.pref_label[lang] || item.pref_label['und'] }}{{ item.secondary ? " [" + item.secondary + "]" : ""}}</option>
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
						<font-awesome-icon icon="sync" spin v-if="busy"/>
						<font-awesome-icon icon="question-circle" v-else/>
					</b-btn>
				</b-input-group-append>
			</b-input-group>

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

		</b-form-group>
	</div>
</template>

<script>
import vSchemaBase from '../v-schema-base.vue'
import esApiClient, {convertToSchemaFields, groupByParent} from './es.js'


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
			//selected: null,
			selected2: null,
			apiValues: null,
			isCached: true,
			editing: true,
			byId: {},
			error: null,
			busy: false,
			filterApiFields: true,
			lang: 'en',
		}
	},
	methods: {
		/*
		evLog: function(e) {
			console.log("evLog: got event", e)
		},
		onInput: function() {
			console.log("event input fired")
		},
		onChange: function() {
			console.log("event change fired")
		},
		*/
		getList: function(index, doctype) {
			console.log("getList()", this.apiValues)
			//if (this.apiValues) return

			// if we already have fresh values, return
			if (!this.isCached) return

			this.busy = true
			let vm = this
			esApiClient(index, doctype)
				.then(response => {
					if (response.data && response.data.hits && response.data.hits.hits) {
						if (this.optgroups) {
							vm.apiValues = groupByParent(response.data.hits.hits)
						} else {
							let results = response.data.hits.hits
							/*
							vm.apiValues = vm.filterApiFields
								? results.map(item => filterKeys(item['_source'], vm.apiFields))
								: results.map(item => item['_source'])
							*/
							vm.apiValues = results.reduce(convertToSchemaFields, [])
						}
						vm.error = null
						vm.isCached = false
					} else {
						vm.apiValues = []
						vm.error = 'no data'
					}
				})
				.catch(error => {
					console.log(error)
					vm.error = 'error calling ElasticSearch API'
					if (error.response && error.response.status) {
						vm.error += ': ' + error.response.status + (error.response.statusText ? '(' + error.response.statusText + ')' : '')
					}
				})
			// "finally() is not a function" :(
				.then(() => {
					vm.busy = false
				})
		},
		indexOf: function(id) {
			if (!this.apiValues) {
				return -1
			}
			for (let i = 0; i < this.apiValues.length; i++) {
				if (this.apiValues['id'] === id) {
					return i
				}
			}
			return -1
		},
	},
	computed: {
		isSet() {
			return this.value && this.value.identifier
		},
		selected: {
			get() {
				//return this.$store.state.obj.message
				return this.value
				/*
				console.log("[refdata] getting value", this.value)
				if (this.value && this.value['identifier']) {
					let index = this.indexOf(this.value.identifier)
					if (index >= 0) {
						return this.items[index]
					} else {
						return this.value
					}
				}
				return null
				*/
				//return this.value || null
			},
			set(newValue, oldValue) {
				//this.$store.commit('updateMessage', value)
				//console.log("selected:", value)
				//this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: this.items[value] })
				console.log("[refdata] setting value to", newValue, oldValue)
				this.$store.commit('updateValue', {
					p: this.parent,
					prop: this.property,
					val: {
						identifier: newValue.identifier,
						pref_label: newValue.pref_label,
					},
				})
				//console.log("[refdata] value set to", this.value)
			},
		},
		groups: function() {
			return this.apiValues ? Object.keys(this.apiValues).sort() : []
		},
		noGroupItems: function() {
			return this.apiValues && this.apiValues[''] && this.apiValues[''].children
				? this.apiValues[''].children
				: []
		},
		placeholder: function() {
			return this.ui['placeholder'] || 'Select an option:'
		},
	},
	watch: {
		selected2: function(val) {
			console.log("selected2 watcher triggered")
			this.$store.commit('updateValue', {
				p: this.parent,
				prop: this.property,
				val: {
					identifier: val.identifier,
					pref_label: val.pref_label,
				},
			})
		},
	},
	created() {
		// if not undefined or null, use whatever we've got;
		// list only gets loaded on click now
		if (this.value && this.value.identifier) {
			console.log("[refdata] created():", this.value)
			this.apiValues = [this.value]
			this.items = [this.value]
			this.editing = false
		}
		//this.getList(this.esIndex, this.esDoctype)
	},
}
</script>
