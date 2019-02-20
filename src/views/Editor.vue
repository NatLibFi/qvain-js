<template>
	<div class="container-fluid limited-width">
		<div>
			<b-button-toolbar class="tool-bar" aria-label="Dataset toolbar">
				<b-button-group size="sm" class="mx-1">
					<b-btn v-b-tooltip.hover title="Create new empty dataset" @click="createNewRecord()">New dataset</b-btn>
					<b-btn v-b-tooltip.hover title="Clone this dataset as new dataset" @click="createCloneRecord()">Clone dataset</b-btn>
				</b-button-group>

				<!--
				<b-input-group size="sm" class="mx-1" prepend="dataset">
					<b-form-input type="text" placeholder="not saved" :value="$store.state.metadata.id || 'new'" readonly></b-form-input>
				</b-input-group>
				-->
				<b-input-group v-if="inDev" size="sm" class="w-25 mx-1" prepend="schema">
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
					<b-btn v-b-tooltip.hover title="Save this dataset" @click="save" :disabled="rateLimited">Save</b-btn>
					<b-btn v-b-tooltip.hover title="Ready to publish" @click="confirmPublish" :disabled="rateLimited">Publish</b-btn>
				</b-button-group>

				<!--
				<b-button-group size="sm" class="mx-1">
					<b-btn v-b-tooltip.hover title="Validate dataset" size="sm" @click="runValidator()" :disabled="unsubscribeFunc !== null">validate</b-btn>
					<b-btn v-b-tooltip.hover title="Validate while editing" size="sm" id="checkbox-live" :pressed="unsubscribeFunc !== null" @change="toggleValidator()" v-model="doLive">live?</b-btn>
				</b-button-group>
				-->

				<b-button-group size="sm" class="mx-1" v-if="inDev">
					<b-btn variant="outline-light" v-b-tooltip.hover title="View dataset JSON" v-b-modal="'dataset-json-modal'">json</b-btn>
					<b-btn variant="outline-light" v-b-tooltip.hover title="Overview" v-b-modal="'dataset-overview-modal'">overview</b-btn>
				</b-button-group>

			</b-button-toolbar>
			<!--
			<p>
				id: {{ id }} isClone: {{ isClone }} params: {{ $router.params }}
			</p>
			-->
		</div>


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


		<!-- Modals -->
		<dataset-json-modal id="dataset-json-modal"></dataset-json-modal>
		<dataset-overview-modal id="dataset-overview-modal"></dataset-overview-modal>

		<div v-if="!loading">
			<!--
				This could be replaced with title from title part?
				<h2>Fairdata dataset</h2>
			-->
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

import debounce from 'lodash.debounce';

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
			inDev: true
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
		confirmPublish() {
			const isExisting = !!this.$store.state.metadata.id;
			if (!isExisting) {
				this.$root.showAlert("Please save your dataset first", "danger");
				return;
			}
			this.showPublishConfirmation = true;
		},
		publish: debounce(async function() {
			try {
				this.showPublishConfirmation = false;
				const isExisting = !!this.$store.state.metadata.id;
				if (isExisting) {
					const { data: { id }} = await apiClient.post("/datasets/" + this.$store.state.metadata.id + "/publish", {});
					this.$root.showAlert("Dataset successfully published", "primary");
				} else {
					this.$root.showAlert("Please save your dataset first", "danger");
				}
			} catch(e) {
				this.$root.showAlert("Publish failed!", "danger")
			}
		}, 3000, { leading: true, trailing: false }),
		save: debounce(async function(){
			try {
				const currentId = this.$store.state.metadata.id;
				const dataset = this.$store.getters.prunedDataset;
				const payload = { dataset, type: 2, schema: "metax-ida" };

				const isExisting = (currentId && currentId !== 'new');
				if (isExisting) {
					payload.id = currentId;
					const response = await apiClient.put("/datasets/" + currentId, payload);

					this.$root.showAlert("Dataset successfully saved", "primary")
				} else {
					const { data: { id }} = await apiClient.post("/datasets/", payload);

					this.$store.commit('setMetadata', { id })
					this.$router.replace({ name: 'tab', params: { id }});

					this.$root.showAlert("Success! Created as " + id, "success");
				}
			} catch(error) {
				this.$root.showAlert("Save failed!", "danger");
			}
		}, 3000, { leading: true, trailing: false }),
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
	},
	computed: {
		tabs() {
			return this.$store.state.hints.tabs.filter(tab => tab.uri)
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

<style lang="scss" scoped>
.tool-bar {
	padding-top: 10px;
	padding-bottom: 10px;
}

.limited-width {
	max-width: 1100px;
}
</style>
