<template>
	<div class="container-fluid">
		<div>
			<b-button-toolbar aria-label="Dataset toolbar" class="my-2">
				<b-button-group size="sm" class="mx-1">
					<b-btn v-b-tooltip.hover title="Create new dataset" :to="{ name: 'editor', params: {id: '123'} }">New</b-btn>
					<b-btn v-b-tooltip.hover title="Create new dataset" :to="{ name: 'home', params: {} }">Blah</b-btn>
					<b-btn v-b-tooltip.hover title="Clone this dataset as new">Clone</b-btn>
				</b-button-group>
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
				<b-btn v-b-tooltip.hover :title="!rateLimited ? 'Ready to publish' : 'Not so fast, buddy...'" @click="publish" :disabled="rateLimited">Publish</b-btn>
					<b-btn v-b-tooltip.hover title="Back to start page" to="/">Cancel</b-btn>
				</b-button-group>

				<b-button-group size="sm" class="mx-1">
					<b-btn v-b-tooltip.hover title="Validate dataset" size="sm" @click="runValidator()" :disabled="unsubscribeFunc !== null">validate</b-btn>
					<b-btn v-b-tooltip.hover title="Validate while editing" size="sm" id="checkbox-live" :pressed="unsubscribeFunc !== null" @change="toggleValidator()" v-model="doLive">live?</b-btn>
				</b-button-group>
			</b-button-toolbar>
		</div>
		<b-alert variant="danger" :show="!!error"><i class="fas fa-ban"></i> API error: {{ error }}</b-alert>

		<h2>Fairdata dataset schema</h2>
		<b-tabs v-if="selectedSchema" v-model="tabIndex">
			<b-tab :title="name ? name : `Tab ${i}`" v-for="(name, i) in tabs" :key="i">
				<component is="schema-tab-selector" v-if="tabIndex == i" :schema="schemaJson" path="" :parent="$store.state" property="record" :value="$store.state.record" :tab="startTab" :activeTab="i+1" :depth="0"></component>
			</b-tab>

			<!-- Render this if no tabs -->
			<div slot="empty" class="text-center text-muted">
				There are no tabs
		</div>
		</b-tabs>

	</div>
</template>

<script>
import Bundle from '@/schemas/bundle.js'
import apiClient from '@/api/client.js'
import jsonPointer from 'json-pointer'
import vSchemaTabSelector from '../widgets/v-schema-tab-selector.vue'
import Validator from '../../vendor/validator/src/validate.js'

const RATE_LIMIT_MSECS = 3000

export default {
	name: "editor",
	//props: ["id"],
	props: {
		id: {
			type: String,
			default: "056bffbc-c41e-dad4-853b-ea9100000001",
		},
	},
	data: function() {
		return {
			selectedSchema: '',
			//schemaOptions: Object.keys(Bundle).map(x => { return { text: bundle[x].name, value: x } }),
			schemaOptions: [],
			schemaJson: {},
			children: [],
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
			rateLimited: false,
		}
	},
	methods: {
		init() {
			if (this.id) {
				// get
				console.warn("calling loadDataset()")
				this.loadDataset(this.id)
				// TODO: set schema here
				this.selectedSchema = Bundle['fairdata']['ida']
			}
			else {
				// new
				console.log("setting default dataset schema")
				this.newDataset()
				this.selectedSchema = Bundle['fairdata']['ida']
			}

			console.warn("calling loadBundle()")
			this.loadBundle(this.selectedSchema)
			//this.subscribeValidator()
			this.$store.commit('resetState')
				this.subscribeValidator()

				// set this to debug store updates
			if (false) {
					this.$store.watch(() => this.$store.state.record, value => {
						console.log("store watcher: record changed")
					})
				}
		},
		/*
		runValidator: function() {
			this.validator = SchemaValidator(this.$store.state.schema, this.$store.state.record)
		},
		*/
		loadBundle: function(bundle) {
			this.$store.commit('loadSchema', bundle.schema)
			this.$store.commit('loadHints', bundle.ui)
			this.schemaJson = bundle.schema

			console.log("loaded schema/ui bundle")
			//this.startTab = 1
		},
		newDataset: function() {
			//this.$store.commit('loadData', undefined)
			this.$store.commit('loadData', {"title": {"en": "Crappy dataset", "fi": "Paska datasetti"}})
		},
		subscribeValidator: function() {
			var vm = this
			this.validator = new Validator(
				this.$store.state.schema,
				this.$store.state.record,
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
		loadDataset: function(id) {
			var vm = this

			vm.error = null

			apiClient.get(`/datasets/${id}`)
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
		},
		save() {
			var vm = this

			vm.error = null
			vm.rateLimited = true

			setTimeout(function() {
				vm.rateLimited = false;
			}, RATE_LIMIT_MSECS);

			console.log("selectedSchema:", this.selectedSchema['id'], Object.keys(this.selectedSchema))
			apiClient.post("/datasets/", {
						dataset: this.$store.state.record,
						type: 2,
						schema: "metax-ida"
					})
				.then(response => {
				console.log("save [success]:", response, response.data)
				console.log("save [continued]:", response)
				vm.$root.showAlert("Success! Saved as " + (response.data.id || "new."))
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
			return this.$store.state.hints.tabs || ['metadata']
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
			this.init()
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
