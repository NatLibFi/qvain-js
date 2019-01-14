<template>
	<div class="container-fluid">
		<div>
			<b-button-toolbar aria-label="Dataset toolbar" class="my-2">
				<b-button-group size="sm" class="mx-1">
					<!--
					<b-btn v-b-tooltip.hover title="Create new dataset" :to="{ name: 'new' }">Route</b-btn>
					-->
					<b-btn v-b-tooltip.hover title="Create new dataset" @click="createNewRecord()">Create new</b-btn>
					<b-btn v-b-tooltip.hover title="Clone this dataset as new" @click="createCloneRecord()">Clone</b-btn>

					<b-btn v-b-tooltip.hover title="View dataset JSON" v-b-modal="'dataset-json-modal'">json</b-btn>
					<b-btn v-b-tooltip.hover title="Overview" v-b-modal="'dataset-overview-modal'">overview</b-btn>

				</b-button-group>

				<!--
				<b-input-group size="sm" class="mx-1" prepend="dataset">
					<b-form-input type="text" placeholder="not saved" :value="$store.state.metadata.id || 'new'" readonly></b-form-input>
				</b-input-group>

				<b-input-group size="sm" class="w-25 mx-1" prepend="schema">
					<b-form-select value="fairdata" v-model="selectedSchema">
					<optgroup :label="bundle" v-for="(bundle, index) in bundles" :key="index">
						<option :value="val" v-for="(val, id) in getSchemas(bundle)" :key="id">{{ val.name }}</option>
					</optgroup>
					</b-form-select>
				</b-input-group>
				<b-input-group size="sm" class="w-25 mx-1" prepend="owner">
					<b-form-select :value="$auth.user ? $auth.user.name : 'you'" :options="[ $auth.user ? $auth.user.name : 'you' ]"></b-form-select>
				</b-input-group>

				<b-button-group size="sm" class="mx-1">
					<b-btn v-b-tooltip.hover :title="!rateLimited ? 'Save this dataset' : 'Not so fast, buddy...'" @click="save" :disabled="rateLimited">Save</b-btn>
					<b-btn v-b-tooltip.hover :title="!rateLimited ? 'Ready to publish' : 'Not so fast, buddy...'" @click="confirmPublish" :disabled="rateLimited">Publish</b-btn>
					<b-btn v-b-tooltip.hover title="Back to start page" to="/">Cancel</b-btn>
				</b-button-group>

				<b-button-group size="sm" class="mx-1">
					<b-btn v-b-tooltip.hover title="Validate dataset" size="sm" @click="runValidator()" :disabled="unsubscribeFunc !== null">validate</b-btn>
					<b-btn v-b-tooltip.hover title="Validate while editing" size="sm" id="checkbox-live" :pressed="unsubscribeFunc !== null" @change="toggleValidator()" v-model="doLive">live?</b-btn>
				</b-button-group>
				-->
			</b-button-toolbar>
			<p>
				id: {{ id }} isClone: {{ isClone }} params: {{ $router.params }}
			</p>
		</div>

		<!--
		<b-alert variant="danger" :show="!!error" dismissible @dismissed="error=null"><i class="fas fa-ban"></i> API error: {{ error }}</b-alert>
		<b-alert variant="warning"><font-awesome-icon icon="info"></font-awesome-icon> Publishing: I understand that publishing this dataset:</b-alert>

		<b-card variant="dark" bg-variant="dark" text-variant="white" v-if="showPublishConfirmation">
			<h3 slot="title">
				<font-awesome-icon icon="info" fixed-width />
				Publishing
			</h3>
			<p class="card-text">I understand that publishing this dataset...</p>
				<ul class="list-unstyled">
					<li class="font-italic">... will make it available publicly</li>
					<li class="font-italic">... marks it as ready and enables editing restrictions</li>
				</ul>
			<p></p>
			<div class="float-right">
				<b-button variant="primary" class="ml-3" @click="showPublishConfirmation = false"><font-awesome-icon icon="times" fixed-width /> cancel</b-button>
				<b-button variant="danger" class="ml-3" @click="showPublishConfirmation = false"><font-awesome-icon icon="info" fixed-width /> go somewhere</b-button>
				<b-button variant="success" class="ml-3" @click="publish()"><font-awesome-icon icon="cloud-upload-alt" fixed-width /> publish</b-button>
			</div>
		</b-card>
		-->

		<!-- Modals -->
		<dataset-json-modal id="dataset-json-modal"></dataset-json-modal>
		<dataset-overview-modal id="dataset-overview-modal"></dataset-overview-modal>

		<div v-if="!loading">
			<h2>Fairdata dataset</h2>
			<ul class="nav nav-tabs">
				<!-- TODO: errors could be shown in tabs also -->
				<li v-for="tab in tabs" :key="tab.uri" class="nav-item">
					<router-link class="nav-link" :to="`/dataset/${id}/${tab.uri}`">{{tab.label}}</router-link>
				</li>
			</ul>

			<div class="container-fluid no-padding my-3">
				<router-view></router-view>
			</div>

		</div>
		<div v-else>
			<font-awesome-icon icon="circle-notch" spin />
		</div>

	</div>
</template>

<script>
import Bundle from '@/schemas/bundle.js'
import apiClient from '@/api/client.js'
import api from '@/api/api.js'
import DatasetJsonModal from '@/components/DatasetJsonModal.vue'
import DatasetOverviewModal from '@/components/DatasetOverviewModal.vue'
import Validator from '../../vendor/validator/src/validate.js'

const RATE_LIMIT_MSECS = 3000

export default {
	name: "editor",
	components: {
		'dataset-json-modal': DatasetJsonModal,
		'dataset-overview-modal': DatasetOverviewModal,
	},
	props: {
		id: {
			type: String,
			default: 'new'
			//default: "056bffbc-c41e-dad4-853b-ea9100000001",
			//default: "05766a68-0519-65ba-885f-e1d375283063",
		},
		isClone: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			selectedSchema: '',
			doLive: true,
			unsubscribeFunc: null,
			validator: null,
			error: null,
			loading: false,
			rateLimited: false,
			showPublishConfirmation: false,
		}
	},
	methods: {
		subscribeValidator: function() {
			let vm = this
			this.validator = new Validator(
				this.$store.state.schema,
				this.$store.state.record,
				{
					'allowUndefined': true,
				},
			)
			this.validator.v = this.$store.state.vState
			console.log("data == store? (before)", this.validator.data == this.$store.state.record)
			this.unsubscribeFunc = this.$store.subscribe((mutation) => {
				if (mutation.type == "updateValue" || mutation.type == "pushValue" || mutation.type == "popValue") {
					if (vm.validator.data !== vm.$store.state.record) {
						console.warn("data == store?", vm.validator.data == vm.$store.state.record)
					}
					console.log("validator ran")
					vm.validator.validateData(vm.$store.state.record)
					//console.warn("data == store? (after validate)", vm.validator.data == vm.$store.state.record, vm.validator.data, vm.$store.state.record)
				}
			})
		},
		unsubscribeValidator: function() {
			this.unsubscribeFunc()
			this.unsubscribeFunc = null
		},
		toggleValidator: function() {
			this.unsubscribeFunc === null ? this.subscribeValidator() : this.unsubscribeValidator()
		},


		getSchemas(bundle) {
			return Bundle[bundle]
		},
		/*confirmPublish() {
			const isExisting = !!this.$store.state.metadata.id

			if (!isExisting) {
				this.$root.showAlert("Please save your dataset first", "danger")
				return
			}
			this.showPublishConfirmation = true
		},*/
		publish() {
			const isExisting = !!this.$store.state.metadata.id
			this.showPublishConfirmation = false

			if (!isExisting) {
				this.$root.showAlert("Please save your dataset first", "danger")
				return
			}

			return apiClient.post("/datasets/" + this.$store.state.metadata.id + "/publish", {})
				.then(response => {
					console.log("save [success]:", response.status)
					if (!isExisting) {
						let id = response.data && response.data.id
						this.$store.commit('setMetadata', {id: id})
						this.$root.showAlert("Success! Created as " + id, "success")
					}
					else {
						this.$root.showAlert("Dataset successfully saved", "primary")
					}
				})
				.catch(error => {
					this.$root.showAlert("Save failed!", "danger")
					this.error = (error.message || error || "unknown error").toLowerCase();
				})
		},
		save() {
			this.error = null
			this.rateLimited = true

			setTimeout(function() {
				vm.rateLimited = false
			}, RATE_LIMIT_MSECS)


			console.log("selectedSchema:", this.selectedSchema['id'], Object.keys(this.selectedSchema))
			const isExisting = !!this.$store.state.metadata.id
			console.log("saving dataset:", this.$store.getters.prunedDataset)

			var apiCall = function(id) {
				if (id && id !== "new") {
					console.log("id exists:", this.$store.state.metadata.id)
					return apiClient.put("/datasets/" + this.$store.state.metadata.id, {
						dataset: this.$store.getters.prunedDataset,
						type: 2,
						schema: "metax-ida",
						id: this.$store.state.metadata.id
					})
				} else {
					console.log("id doesn't exist")
					return apiClient.post("/datasets/", {
						dataset: this.$store.getters.prunedDataset,
						type: 2,
						schema: "metax-ida"
					})
				}
			}.bind(this)(this.$store.state.metadata.id)
			apiCall
				.then(response => {
					console.log("save [success]:", response.status)
					if (!isExisting) {
						let id = response.data && response.data.id
						this.$store.commit('setMetadata', {id: id})
						vm.$root.showAlert("Success! Created as " + id, "success")
					}
					else {
						vm.$root.showAlert("Dataset successfully saved", "primary")
					}
				})
				.catch(error => {
					vm.$root.showAlert("Save failed!", "danger")

					vm.setError(
						error.response && error.response.data && error.response.data.msg ? error.response.data.msg : (error.message || error || "unknown error").toLowerCase(),
						error.status
					)
					if (error.response) {
						console.log("details:", error.response)
					}
				})
		},
		/*
		init(id, isClone) {
			// stop updating UI
			this.ready = false
			this.loading = true
			this.error = null
			let loader = id && id !== "new" ? this.getDataset(id) : this.newDataset(isClone)

			console.log("init called with dataset id:", id, this.$route.params.id, this.$route.params.isClone)
			console.log("loader:", loader)
			console.log("[1] current route is", this.$route)

			// load empty or existing dataset, then...
			loader.then(() => {
				// data loading succeeded, load schema
				this.$nextTick(() => {
					console.log("setting ready to true")
					this.ready = true
				})
				this.selectedSchema = Bundle['fairdata']['ida']
				this.$store.commit('loadSchema', this.selectedSchema.schema)
				this.$store.commit('loadHints', this.selectedSchema.ui)
			}).then(() => {
				// start validator
				this.subscribeValidator()
				// set this to debug store updates
				if (DEBUG_STORE_UPDATES) {
					this.$store.watch(() => this.$store.state.record, value => {
						console.log("store watcher: record changed")
					})
				}
			}).then(() => {
				// have data, schema and validator; redirect to first tab
				console.log("current route is", this.$route)
				console.log("tabs:", this.selectedSchema.ui.tabs)
				let firstTab = this.selectedSchema && this.selectedSchema.ui && this.selectedSchema.ui.tabs && this.selectedSchema.ui.tabs[0] && this.selectedSchema.ui.tabs[0].uri || null
				console.log("first tab:", firstTab)
				//this.$router.push({ name: 'editor', params: { id: this.id, tab: firstTab }})
				//this.$router.push({ name: 'editor', params: { tab: firstTab }})
				// Vue router doesn't react to changes to params
				//this.$router.replace(this.$route.path + '/' + firstTab)
				this.$router.replace({ name: 'tab', params: { tab: firstTab }})
			})
			.catch(error => {
				// if we haven't handled the error before in a more specific catch block...
				if (!this.error) {
					console.error(error)
				}
			})

			this.loading = false
		},*/
		createNewRecord() {
			this.loading = true;
			this.$nextTick(() => {
				this.clearRecord();
				this.initDataset();
				this.loading = false;
			});
		},
		createCloneRecord() {
			this.loading = true;
			this.$nextTick(() => {
				this.cloneCurrentRecord();
				this.initDataset();
				this.loading = false;
			});
		},
		initDataset() {
			this.selectedSchema = Bundle['fairdata']['ida'];
			this.$store.commit('loadSchema', this.selectedSchema.schema);
			this.$store.commit('loadHints', this.selectedSchema.ui);

			// start validator
			this.subscribeValidator();
		},

		clearRecord() {
			this.$router.replace({ name: 'tab', params: { id: 'new', tab: 'description' }});
			this.$store.commit('loadData', undefined);
			this.$store.commit('resetMetadata');
		},
		cloneCurrentRecord() {
			this.$router.replace({ name: 'tab', params: { id: 'new', tab: 'description' }});
			this.$store.commit('resetMetadata');
		},
		async openRecord(id) {
			try {
				this.loading = true;

				const { data: { dataset } } = await apiClient.get(`/datasets/${id}`);
				this.$store.commit('loadData', Object(dataset));
				this.$store.commit('setMetadata', { id });
			} finally {
				this.loading = false;
			}
		},

		/*create() {
			this.$router.replace({ name: 'editor', params: { id: 'new' }});
			this.init('new');
		},
		clone() {
			this.$router.replace({ name: 'editor', params: { id: 'new', isClone: true }});
			this.init('new', true);
		},*/

		redirectToFirstTab() {
			const firstTab = this.selectedSchema &&
				this.selectedSchema.ui &&
				this.selectedSchema.ui.tabs &&
				this.selectedSchema.ui.tabs[0] &&
				this.selectedSchema.ui.tabs[0].uri ||
				null;

			this.$router.replace({ name: 'tab', params: { tab: firstTab }});
		}
	},
	computed: {
		tabs() {
			return this.$store.state.hints.tabs
		},
		bundles() {
			return Object.keys(Bundle)
		},
	},
	watch: {
		'$route.params.id': async function(newId, oldId) {
			console.log("$route.params.id watcher triggered from", oldId, newId);
			if (this.id !== 'new') {
				await this.openRecord(this.id);
			} else {
				this.clearRecord();
			}
		},
	},
	async created() {
		if (this.id !== 'new') {
			await this.openRecord(this.id);
		} /*
		// on later date add possibility to clear on clear=true route param
		// and by default load stored data from localStorage
		else if(this.clear) {
			this.clearRecord();
		} else {
			this.loadFromStorage();
		}*/

		this.initDataset();
	},
}
</script>

<style>
.nav-tabs .nav-link.active,
.nav-tabs .nav-link.router-link-active,
.nav-tabs .nav-item.show .nav-link {
	color: #495057;
	background-color: #fff;
	border-color: #dee2e6 #dee2e6 #fff;
}

.no-padding {
	padding-left: 0;
	padding-right: 0;
}
</style>
