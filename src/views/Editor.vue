<template>
	<div class="container-fluid">
		<div>
		id: {{ id }} isClone: {{ isClone }} params: {{ $router.params }}
			<b-button-toolbar aria-label="Dataset toolbar" class="my-2">
				<b-button-group size="sm" class="mx-1">
					<b-btn v-b-tooltip.hover title="Create new dataset" :to="{ name: 'new' }">Route</b-btn>
					<b-btn v-b-tooltip.hover title="Create new dataset" @click="create()">new</b-btn>
					<b-btn v-b-tooltip.hover title="Clone this dataset as new" @click="clone()">Clone</b-btn>
					<b-btn v-b-tooltip.hover title="View dataset JSON" v-b-modal="'dataset-json-modal'">json</b-btn>
					<b-btn v-b-tooltip.hover title="Overview" v-b-modal="'dataset-overview-modal'">overview</b-btn>
				</b-button-group>

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
			</b-button-toolbar>
		</div>
		<b-alert variant="danger" :show="!!error" dismissible @dismissed="error=null"><i class="fas fa-ban"></i> API error: {{ error }}</b-alert>
		<b-alert variant="warning"><font-awesome-icon icon="info"></font-awesome-icon> Publishing: I understand that publishing this dataset:</b-alert>

		<dataset-json-modal id="dataset-json-modal"></dataset-json-modal>
		<dataset-overview-modal id="dataset-overview-modal"></dataset-overview-modal>

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

		<div v-if="ready" :key="renderKey">
			<h2>Fairdata dataset</h2>
			<ul class="nav nav-tabs">
				<!-- TODO: errors could be shown in tabs also -->
				<li v-for="tab in tabs" :key="tab.uri" class="nav-item">
					<router-link class="nav-link" :to="`/dataset/${id}/${tab.uri}`">{{tab.label}}</router-link>
				</li>
			</ul>

			<div class="container-fluid my-3">
				<router-view></router-view>
			</div>

		</div>
		<div v-else>
			<font-awesome-icon icon="circle-notch" spin v-if="this.loading" />
		</div>

	</div>
</template>

<script>
import Bundle from '@/schemas/bundle.js'
import api from '@/api/client.js'
import vSchemaTabSelector from '@/widgets/v-schema-tab-selector.vue'
import DatasetJsonModal from '@/components/DatasetJsonModal.vue'
import DatasetOverviewModal from '@/components/DatasetOverviewModal.vue'
import Validator from '../../vendor/validator/src/validate.js'

const RATE_LIMIT_MSECS = 3000
const DEBUG_STORE_UPDATES = false

export default {
	name: "editor",
	//props: ["id"],
	props: {
		id: {
			type: String,
			//default: "056bffbc-c41e-dad4-853b-ea9100000001",
			//default: "05766a68-0519-65ba-885f-e1d375283063",
		},
		isClone: {
			type: Boolean,
			default: false,
		},
	},
	data: function() {
		return {
			selectedSchema: '',
			//schemaOptions: Object.keys(Bundle).map(x => { return { text: bundle[x].name, value: x } }),
			schemaOptions: [],
			schemaJson: {},
			validity: {
				valid: false,
			},
			value: undefined,
			doLive: true,
			unsubscribeFunc: null,
			startTab: 1,
			tabIndex: null,
			validator: null,
			error: null,
			ready: false,
			loading: false,
			renderKey: 666,
			rateLimited: false,
			showPublishConfirmation: false,
		}
	},
	methods: {
		setEmptySchema() {
			this.$store.commit('loadSchema', {"type": "object", "title": "empty schema"})
		},
		changeSchema() {
			this.$store.commit('changeSchema')
			//this.renderKey += 1
		},
		reset() {
			console.log(this.$route, this.$route.params)
			this.$set(this.$route.params, 'id', null)
			console.log(this.$route.params)
		},
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
		},
		/*
		runValidator: function() {
			this.validator = SchemaValidator(this.$store.state.schema, this.$store.state.record)
		},
		*/
		loadBundle: function(bundle) {
			this.$store.commit('loadSchema', bundle.schema)
			this.$store.commit('loadHints', bundle.ui)
			//this.schemaJson = bundle.schema

			console.log("loaded schema/ui bundle")
		},
		newDataset: function(isClone) {
			return new Promise((resolve, reject) => {
				if (!isClone) {
					console.log("resetting data", this.isClone, this.$route.params)
					this.$store.commit('loadData', undefined)
				}
				this.$store.commit('resetMetadata')
				resolve("loaded")
			})
		},
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
		getDataset: function(id) {
			return api.client.get(`/datasets/${id}`)
				.then(response => {
					this.$store.commit('loadData', response.data.dataset);
					this.$store.commit('setMetadata', {id: id});
				})
				.catch(error => {
					// catch API errors and set error, but rethrow to stop the promise chain
					// print backend error `msg` if there is one; otherwise show error from object or string (e.g. browser's Network Error)
					this.setError(
						error.response && error.response.data && error.response.data.msg ? error.response.data.msg : (error.message || error || "unknown error").toLowerCase(),
						error.status
					);
					return Promise.reject("api error")
				})
		},
		setErrorFromResponse(error) {
			this.$root.showAlert("Save failed!", "danger");
			const dataMessage = error.response &&
				error.response.data &&
				error.response.data.msg;

			const errorMessage = error.message;
			this.error = (dataMessage || errorMessage || "unknown error").toLowerCase();
		},
		save() {
			// TODO: what is rate limit?
			const id = this.$store.state.metadata.id;
			const dataset = this.$store.getters.prunedDataset;

			const isExisting = id !== null && typeof id !== 'undefined';

			const processResults = response => {
				if (!isExisting) {
					this.$store.commit('setMetadata', {id: response.data.id});
					this.$root.showAlert("Success! Created as " + id, "success");
				} else {
					this.$root.showAlert("Dataset successfully saved", "primary");
				}
			}



			(isExisting ? api.updateDataset(id) : api.addDataset)(dataset)
				.then(processResults)
				.catch(setErrorFromResponse);
		},
		confirmPublish() {
			const isExisting = !!this.$store.state.metadata.id

			if (!isExisting) {
				this.$root.showAlert("Please save your dataset first", "danger")
				return
			}
			this.showPublishConfirmation = true
		},
		publish() {
			const isExisting = !!this.$store.state.metadata.id
			this.showPublishConfirmation = false

			if (!isExisting) {
				this.$root.showAlert("Please save your dataset first", "danger")
				return
			}

			var vm = this

			return api.client.post("/datasets/" + this.$store.state.metadata.id + "/publish", {})
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
				})
		},
		setError(msg, status) {
			this.error = msg
		},
		resetError() {
			this.error = null
		},
		open(id) {
			// vue router doesn't detect changes to params if the route endpoint stays the same
			console.log("request to open dataset", id)
			this.$router.push({ name: 'editor', params: { id: id }})
		},
		create() {
			// this is likely no-op except for changing the URL
			this.$router.replace({ name: 'editor', params: { id: 'new' }})
			// vue router doesn't detect changes to params if the route endpoint stays the same
			this.init('new')
		},
		clone() {
			// this is likely no-op except for changing the URL
			this.$router.replace({ name: 'editor', params: { id: 'new', isClone: true }})
			this.init('new', true)
			this.$root.showAlert("Dataset successfully cloned. Remember to save this copy!", "success")
		},
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
		selectedSchema: function() {

			if (!(this.selectedSchema)) {
				console.log("selectedSchema triggered without schema!")
				return
			}
			//this.init()
			console.log("selectedSchema() triggered")
		},
		'$route.params.id': function(id) {
			console.warn("$route.params.id watcher triggered for id", id)
		},
		/*
		'$route': function(route) {
			console.warn("$route watcher triggered for route", route)
		},
		*/
		'$route': {
			deep: true,
			handler: function (route) {
				console.warn("$route (deep) watcher triggered for route", route)
			}
		},
		id: function(id) {
			console.warn("id watcher ran", id)
			this.init(id)
		},
	},
	components: {
		'schema-tab-selector': vSchemaTabSelector,
		'dataset-json-modal': DatasetJsonModal,
		'dataset-overview-modal': DatasetOverviewModal,
	},
	/*
	beforeRouteUpdate (to, from, next) {
		console.warn("beforeRouteUpdate() called", from, to)
		next()
	},
	*/
	created() {
		console.log("[editor] created called, calling init")
		this.init(this.$route.params.id)
	},
	mounted() {
		this.$nextTick(function () {
			// Code that will run only after the entire view has been rendered
			console.warn("[editor] mounted triggered [READY]")
		})
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
</style>
