<template>
	<b-container fluid>
		<h1 class="component-title">My datasets</h1>

		<!-- controls -->
		<b-button-toolbar class="mb-4">
			<b-button-group size="sm">
				<b-btn class="dataset-filter__button" :pressed="showDatasetState === 'all'" @click="() => showDatasetState = 'all'" variant="outline-success" v-b-tooltip.hover.bottom title="show draft datasets">All</b-btn>
				<b-btn class="dataset-filter__button" :pressed="showDatasetState === 'draft'" @click="() => showDatasetState = 'draft'" variant="outline-success" v-b-tooltip.hover.bottom title="show draft datasets">Draft</b-btn>
				<b-btn class="dataset-filter__button" :pressed="showDatasetState === 'published'" @click="() => showDatasetState = 'published'" variant="outline-success" v-b-tooltip.hover.bottom title="show published datasets">Published</b-btn>
			</b-button-group>

			<b-input-group size="sm" class="ml-2" :style="{'flex-grow': '1'}" v-b-tooltip.hover.bottom title="Search from titles" prepend="Search">
				<b-form-input v-model="filterString" placeholder="title" />
			</b-input-group>

			<b-button-group class="ml-2 new-record" size="sm">
				<b-btn class="new-record__button" variant="primary" @click="createNewRecord">Create new record</b-btn>
			</b-button-group>
		</b-button-toolbar>

		<!-- alerts -->
		<b-alert variant="danger" :show="!!error" dismissible @dismissed="error = null">{{ error }}</b-alert>
		<b-alert variant="warning" :show="!!devWarning" dismissible @dismissed="devWarning = false"><strong>Development environment</strong> – you are viewing fake API data.</b-alert>

		<!-- table -->
		<b-table id="dataset-list" ref="datasetTable" :items="datasetList" :fields="fields" select-mode="single" striped hover show-empty selectable :tbody-tr-class="rowClass" filter="truthy value" :filter-function="filter" no-provider-filtering no-provider-sorting :busy.sync="isBusy" primary-key="id" :tbody-transition-props="{'name': 'datasets-flip'}">
			<template slot="published" slot-scope="row">
				<div :style="{ 'display': 'inline-flex' }">
					<font-awesome-icon icon="circle" class="text-success text-small text-center fa-xs" style="margin: 3px;" fixed-width v-if="row.item.published" />
					<font-awesome-icon icon="circle" class="text-light text-small text-center fa-xs" style="color: #abcdef !important; margin: 3px;" fixed-width v-else />
					<p v-if="row.item.published">Published</p>
					<p v-else>Draft</p>
				</div>
			</template>
			<template slot="owner" slot-scope="data">
				<span v-b-tooltip.hover.auto :title="data.item.uid">{{ data.item.owner }}</span>
			</template>
			<template slot="preservation_state" slot-scope="data">
				<preservation-state :state="data.item.preservation_state"/>
			</template>
			<template slot="created" slot-scope="row">
				{{ readableIso(row.item.created) }} <p style="margin-bottom: 0px;" class="text-muted"><small>{{ friendlyDate(row.item.created) }} ago</small></p>
			</template>
			<template slot="title" slot-scope="row">
				<h5 class="mb-1">{{ preferredLanguage(row.item.title) }}</h5>
				<p v-if="row.item.description" class="text-muted" style="display: inline-block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 24rem; margin: 0px;">
					<small>{{ preferredLanguage(row.item.description) }}</small>
				</p>
			</template>
			<template slot="actions" slot-scope="row">
				<div class="actions">
					<b-button variant="primary" size="sm" @click.stop="open(row.item.id)"><font-awesome-icon icon="pen" fixed-width />Edit</b-button>
					<b-button variant="primary" size="sm" @click.stop="view(row.item.identifier)" :disabled="row.item.identifier == null"><font-awesome-icon icon="external-link-alt" fixed-width />View in Etsin</b-button>

					<b-dropdown variant="primary" right text="More" size="sm">
						<b-dropdown-item-button size="sm" v-b-modal="'dataset-versions-modal'" @click="activeInModal = row.item.id" :disabled="row.item.versions < 1">
							<font-awesome-icon icon="history" fixed-width />Versions
						</b-dropdown-item-button>

						<b-dropdown-item-button :disabled="row.item.published" size="sm" variant="danger" @click="itemToBeDeleted = row.item.id" v-b-modal.deleteModal>
							<font-awesome-icon icon="trash" fixed-width />Delete
						</b-dropdown-item-button>
					</b-dropdown>
				</div>
			</template>
		</b-table>

		<!-- modals -->
		<b-modal ref="deleteModal" id="deleteModal" title="Delete dataset?"
			ok-title="Delete" cancel-variant="primary" ok-variant="danger"
			@ok="del">
			<p :style="{'text-align': 'center'}">
				You are about to delete a dataset. This action cannot be reversed. Are you sure you want to delete the dataset?
			</p>
		</b-modal>

		<dataset-versions-modal :dataset="activeInModal"></dataset-versions-modal>

	</b-container>
</template>

<style lang="scss" scoped>
	.actions {
		width: 265px !important;
		button {
			margin-right: 10px;
		}
	}
</style>


<style>
	/* controls */
	.dataset-filter__button.btn-outline-success:focus {
		box-shadow: none !important;
	}

	table#dataset-list thead > tr > th {
		border-bottom: 0px;
    	border-top: 0px;
	}


	table#dataset-list tbody > tr > td {
		padding: 0.5em !important;
		border-top: 0px;
	}

	table#dataset-list.table-striped tbody tr:nth-of-type(odd) {
    	background-color: rgba(0, 146, 199, 0.1);
	}
</style>

<script>
import apiClient from '@/api/client.js'
import testList from '@/api/test-datasets.json'
import PreservationState from '@/components/PreservationState.vue'
import BusyButton from '@/components/BusyButton.vue'
import DatasetVersionsModal from '@/components/VersionsModal.vue'

import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import formatDate from 'date-fns/format'

// id owner created modified published identifier title{} description{} preservation_state
const fields = [
	{ label: "Published",   key: "published",          sortable: false },
	{ label: "Title",       key: "title",              sortable: true, formatter: 'preferredLanguage' },
	{ label: "Created",     key: "created",            sortable: true },
	{ label: "PAS State",   key: "preservation_state", sortable: false },
	{ label: "Actions",     key: "actions",            sortable: false },
]

function getApiError(error) {
	let apiError = "API Error"
	//console.log("api error:", error)
	if (error.response) {
		apiError += " [" + error.response.status + "]"
		if (error.response.data && error.response.data.msg) {
			apiError += ": " + error.response.data.msg
		}
	} else if (error.message) {
		apiError += ": " + error.message.toLowerCase()
	}
	return apiError
}

// fakeFetch returns a promise that fakes an Axios response.
const fakeFetch = (data, delay = 0) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				data: data,
				status: 200,
				statusText: 'OK',
			})
		}, delay)
	})
}

export default {
	name: "dataset-list",
	components: {
		PreservationState,
		BusyButton,
		DatasetVersionsModal,
	},
	data() {
		return {
			activeInModal: null,
			fields: fields,
			filterString: null,
			showDatasetState: 'all',
			isBusy: false,
			error: null,
			devWarning: process.env.VUE_APP_ENVIRONMENT === 'development',
			datasetList: [],
			itemToBeDeleted: null
		}
	},
	methods: {
		async fetchDataset() {
			try {
				this.error = null
				const { data } = await (process.env.VUE_APP_ENVIRONMENT !== 'development' && !process.env.VUE_APP_QVAIN_API_URL ?
					fakeFetch(testList, 500) : apiClient.get("/datasets/"))
				this.datasetList = data
			} catch (e) {
				this.error = getApiError(e)
				this.datasetList = []
			}
		},
		open(id) { // should maybe later be changed to link so that accessability is better
			this.$router.push({ name: 'tab', params: { id: id, tab: 'description' }})
		},
		async del(id) {
			this.error = null
			try {
				await apiClient.delete("/datasets/" + id)
				this.$root.showAlert("successfully deleted dataset", "success")

				await this.fetchDataset()
				this.$refs.datasetTable.refresh()
			} catch(e) {
				this.error = getApiError(e)
			}
		},
		view(extid) {
			console.log("opening:", `{process.env.VUE_APP_ETSIN_API_URL}/{extid}`)
			window.open(`${process.env.VUE_APP_ETSIN_API_URL}/${extid}`, '_blank')
		},
		friendlyDate: distanceInWordsToNow,
		readableIso(iso) {
			return formatDate(iso, "YYYY-MM-DD HH:mm:ss")
		},
		preferredLanguage(langObj) {
			if (typeof langObj === "string") {
				return langObj
			} else if (typeof langObj !== "object" || langObj === null) {
				return "–"
			}
			return langObj[this.$root.language] || langObj['en'] || langObj['fi'] || langObj['se'] || langObj[Object.keys(langObj)[0]] || ""
		},
		filter(item) {
			return this.filterState(item) && this.filterTitles(item)
		},
		filterState(item) {
			return this.showDatasetState === 'all' ||
				(this.showDatasetState === 'published' && item.published) ||
				(this.showDatasetState === 'draft' && !item.published)
		},
		filterTitles: function(item) {
			if (!this.filterString) return true // don't filter null.toString()

			// use reactivity to cache regex
			//let regex = new RegExp('.*' + this.filterString + '.*', 'ig')
			let regex = this.filterRegExp

			// search only in the user's preferred language, which is slower, but less likely to confuse
			//const test = regex.test(item.title)
			const test = regex.test(this.preferredLanguage(item.title))
			regex.lastIndex = 0
			return test
		},
		refresh() {
			this.$refs.datasetTable.refresh()
		},
		rowClass(item, type) {
			if (!item) return
			if ('#' + item.id === this.$route.hash) {
				return 'table-warning alert-warning'
			}
		},
		createNewRecord() {
			this.$store.commit('loadData', undefined)
			this.$store.commit('resetMetadata')

			this.$store.commit('loadSchema', {})
			this.$store.commit('loadHints', {})

			this.$router.replace({ name: 'tab', params: { id: 'new', tab: 'description' }})
		},
	},
	computed: {
		filterRegExp() {
			return new RegExp('.*' + this.filterString + '.*', 'ig')
		},
	},
	async created() {
		await this.fetchDataset()
	},
}
</script>
