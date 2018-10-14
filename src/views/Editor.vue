<template>
	<div class="container-fluid">
		<div>
			<b-button-toolbar aria-label="Dataset toolbar" class="my-2">
				<b-button-group size="sm" class="mx-1">
					<b-btn v-b-tooltip.hover title="Create new dataset" :to="{ name: 'editor', params: {id: null} }">New</b-btn>
					<b-btn v-b-tooltip.hover title="Create new dataset" @click="init()">New</b-btn>
					<b-btn v-b-tooltip.hover title="Empty schema" @click="setEmptySchema">Empty</b-btn>
					<b-btn v-b-tooltip.hover title="Change title" @click="changeSchema">change title</b-btn>
					<b-btn v-b-tooltip.hover title="Home" :to="{ name: 'home', params: {} }">Home</b-btn>
					<b-btn v-b-tooltip.hover title="Clone this dataset as new">Clone</b-btn>
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
		<b-alert variant="danger" :show="!!error"><i class="fas fa-ban"></i> API error: {{ error }}</b-alert>
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
				<b-button variant="success" class="ml-3" @click="showPublishConfirmation = false"><font-awesome-icon icon="cloud-upload-alt" fixed-width /> publish</b-button>
			</div>
		</b-card>

		<div v-if="ready" :key="renderKey">

		<h2>Fairdata dataset</h2>
		<ul class="nav nav-tabs">
			<!-- TODO: errors could be shown in tabs also -->
			<li v-for="tab in tabs" :key="tab.uri" class="nav-item">
				<router-link class="nav-link" :to="`/dataset/${tab.uri}`">{{tab.label}}</router-link>
			</li>
		</ul>

		<div class="container-fluid my-3">
			<router-view></router-view>
		</div>

		</div>

	</div>
</template>

<script>
import Bundle from '@/schemas/bundle.js'
import apiClient from '@/api/client.js'
import jsonPointer from 'json-pointer'
import vSchemaTabSelector from '../widgets/v-schema-tab-selector.vue'
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
			default: "05766a68-0519-65ba-885f-e1d375283063",
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
		init() {
			// stop updating UI
			this.ready = false
			console.log("init called:", this.id)
			/*
			if (this.id) {
				// get
				console.warn("calling getDataset()")
				this.getDataset(this.id)
				//this.selectedSchema = Bundle['fairdata']['ida']

				// TODO: set schema here
				//this.selectedSchema = Bundle['fairdata']['ida']
				//this.$store.commit('loadSchema', this.selectedSchema.schema)
				//this.$store.commit('loadHints', this.selectedSchema.ui)
			}
			else {
				// new
				console.log("setting default dataset schema")
				//this.newDataset()
				//this.$store.commit('loadData', {"title": {"en": "Example empty dataset", "fi": "Tietoaineiston esimerkki"}})
				this.selectedSchema = Bundle['fairdata']['ida']
				//this.$store.commit('loadSchema', this.selectedSchema.schema)
				//this.$store.commit('loadHints', this.selectedSchema.ui)

			}
			*/
			var loader = this.id ? this.getDataset() : this.newDataset()

			loader.then(() => {
				this.$nextTick(() => {
					console.log("setting ready to true")
					this.ready = true
				})
				this.selectedSchema = Bundle['fairdata']['ida']
				this.$store.commit('loadSchema', this.selectedSchema.schema)
				this.$store.commit('loadHints', this.selectedSchema.ui)
			})
			.then(() => {
				this.subscribeValidator()
				// set this to debug store updates
				if (DEBUG_STORE_UPDATES) {
					this.$store.watch(() => this.$store.state.record, value => {
						console.log("store watcher: record changed")
					})
				}
			})

			//this.$store.commit('resetState')
			//this.$store.state.schema.title["description"] = "old schema"
			//let schemaKeys = Object.keys(this.$store.state.schema).length
			//const roSchema = this.selectedSchema
			//console.warn("calling loadBundle()", this.$store.state.record, this.$store.state.schema, schemaKeys)
			/*
			this.selectedSchema = Bundle['fairdata']['ida']
			this.$store.commit('loadSchema', this.selectedSchema.schema)
			this.$store.commit('loadHints', this.selectedSchema.ui)
			*/
			//if (schemaKeys < 1) {
				//console.warn("loading roSchema:", roSchema)
				//this.loadBundle(this.selectedSchema)

				//this.loadBundle(roSchema)
			//}
			//setTimeout(this.loadBundle(this.selectedSchema), 2000)
			//console.warn("called loadBundle()", this.$store.state.record, this.$store.state.schema)
			//this.subscribeValidator()
			//this.subscribeValidator()
			//this.$nextTick(() => {
			//	console.log("setting ready to true")
			//	this.ready = true
			//})
			//this.selectedSchema = Bundle['fairdata']['ida']
			//this.renderKey += 1
			//this.$store.commit('loadSchema', this.selectedSchema.schema)
			//this.$store.commit('loadHints', this.selectedSchema.ui)

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
		newDataset: function() {
			this.$store.commit('loadData', undefined)
			this.$store.commit('resetMetadata')
			//this.$store.commit('loadData', {"title": {"en": "Example empty dataset", "fi": "Tietoaineiston esimerkki"}})
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
			//console.log("store:", this.$store, unsubscribe)
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
			let vm = this

			vm.error = null

			return apiClient.get(`/datasets/${id}`)
				.then(response => {
					if (response && response.data) {
						console.log("load [success]:", response, response.data)
						// Object() will create an empty object if undefined or null, otherwise returns the value
						this.$store.commit('loadData', Object(response.data.dataset))
						this.$store.commit('setMetadata', {id: id})
						return
					}
					throw "empty response"
				})
				.catch(error => {
				// keys: config, request, response
					console.log("error GET:", error, Object.keys(error))
					// print backend error `msg` if there is one; otherwise show error from object or string (e.g. browser's Network Error)
					vm.setError (
						error.response && error.response.data && error.response.data.msg ? error.response.data.msg : (error.message || error || "unknown error").toLowerCase(),
						error.status
					)
					//vm.error = error.response && error.response.data && error.response.data.msg ? error.response.data.msg : (error.message || error || "unknown error").toLowerCase()
					if (error.response) {
						console.log("details:", error.response)
					}
				})
				/*
				.then(() => {
					this.$nextTick(() => {
						console.log("setting ready to true")
						this.ready = true
					})
					this.selectedSchema = Bundle['fairdata']['ida']
					this.$store.commit('loadSchema', this.selectedSchema.schema)
					this.$store.commit('loadHints', this.selectedSchema.ui)
				})
				.then(() => {
					this.subscribeValidator()
				})
				*/
		},
		save() {
			let vm = this

			vm.error = null
			vm.rateLimited = true

			setTimeout(function() {
				vm.rateLimited = false
			}, RATE_LIMIT_MSECS)


			console.log("selectedSchema:", this.selectedSchema['id'], Object.keys(this.selectedSchema))

			var apiCall
			const isExisting = !!this.$store.state.metadata.id

			var apiCall = function(id) {
				if (id) {
					console.log("id exists:", this.$store.state.metadata.id)
					return apiClient.put("/datasets/" + this.$store.state.metadata.id, {
						dataset: this.$store.state.record,
						type: 2,
						schema: "metax-ida",
						id: this.$store.state.metadata.id
					})
				} else {
					console.log("id doesn't exist")
					apiCall = apiClient.post("/datasets/", {
						dataset: this.$store.state.record,
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
					vm.setError (
						error.response && error.response.data && error.response.data.msg ? error.response.data.msg : (error.message || error || "unknown error").toLowerCase(),
						error.status
					)
					if (error.response) {
						console.log("details:", error.response)
					}
				})
		},
		confirmPublish() {
			this.showPublishConfirmation = true
		},
		publish() {
			console.log("publish clicked")
		},
		setError(msg, status) {
			this.error = msg
		},
		resetError() {
			this.error = null
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
	},
	components: {
		'schema-tab-selector': vSchemaTabSelector,
	},
	created() {
		console.log("[editor] created called, calling init")
		this.init()
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
