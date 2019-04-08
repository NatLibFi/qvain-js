<template>
	<b-container fluid>
		<h1 class="component-title">My datasets</h1>

		<div :style="{'margin-left': '0px !important', 'margin-right': '0px !important'}" class="my-3 row">
			<b-button-toolbar aria-label="dataset list toolbar">
				<b-button-group size="sm">
					<b-btn :pressed.sync="showDatasetState.draft" variant="outline-secondary" v-b-tooltip.hover.bottom title="show draft datasets">draft</b-btn>
					<b-btn :pressed.sync="showDatasetState.published" variant="outline-secondary" v-b-tooltip.hover.bottom title="show published datasets">published</b-btn>
				</b-button-group>

				<b-input-group size="sm" class="mx-1 px-1" left="search" v-b-tooltip.hover.bottom title="search titles" prepend="search">
					<b-form-input v-model="filterString" placeholder="title" />
				</b-input-group>
			</b-button-toolbar>

			<b-button-group class="new-record" size="sm">
				<b-btn class="new-record__button" variant="primary" @click="createNewRecord">Create new record</b-btn>
			</b-button-group>
		</div>

		<b-alert variant="danger" ref="datasetErrorAlert" :show="!!error" dismissible @dismissed="error = null">{{ error }}</b-alert>
		<b-alert variant="warning" :show="!!devWarning" dismissible @dismissed="devWarning = false"><strong>development environment</strong> – you are viewing fake API data.</b-alert>

		<dataset-versions-modal :dataset="activeInModal"></dataset-versions-modal>

		<b-table id="dataset-table" ref="datasetTable" class="m-1" striped hover show-empty selectable select-mode="single" :tbody-tr-class="rowClass" :items="datasetList" :fields="fields" filter="truthy value" :filter-function="filter" no-provider-filtering no-provider-sorting :busy.sync="isBusy" primary-key="id" :tbody-transition-props="{'name': 'datasets-flip'}">
			<template slot="published" slot-scope="row">
				<font-awesome-icon icon="circle" class="text-success text-small text-center fa-xs" fixed-width v-if="row.item.published" />
				<font-awesome-icon icon="circle" class="text-light text-small text-center fa-xs" style="color: #abcdef;" fixed-width v-else />
			</template>
			<template slot="owner" slot-scope="data">
				<span v-b-tooltip.hover.auto :title="data.item.uid">{{ data.item.owner }}</span>
			</template>
			<template slot="preservation_state" slot-scope="data">
				<preservation-state :state="data.item.preservation_state"/>
			</template>
			<template slot="created" slot-scope="row">
				{{ readableIso(row.item.created) }} <p class="text-muted"><small>{{ friendlyDate(row.item.created) }} ago</small></p>
			</template>
			<template slot="title" slot-scope="row">
				<h5 class="mb-1">{{ preferredLanguage(row.item.title) }}</h5>
				<p v-if="row.item.description" class="text-muted" style="display: inline-block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 24rem;">
					<small>{{ preferredLanguage(row.item.description) }}</small>
				</p>
			</template>
			<template slot="actions" slot-scope="row">
				<b-button-group>
					<b-button size="sm" @click.stop="open(row.item.id)"><font-awesome-icon icon="pen" fixed-width /> open</b-button>
					<b-button size="sm" @click.stop="view(row.item.identifier)" :disabled="row.item.identifier == null"><font-awesome-icon icon="external-link-alt" fixed-width /> view</b-button>
					<b-button size="sm" v-b-modal="'dataset-versions-modal'" @click="activeInModal = row.item.id" :disabled="row.item.versions < 1"><font-awesome-icon icon="history" fixed-width /> versions</b-button>
					<b-button size="sm" variant="danger" @click.stop="del(row.item.id)"><font-awesome-icon icon="trash" fixed-width /> delete</b-button>
					<b-button size="sm" variant="secondary" @click.stop="toggleDetails(row.item.id, row)" class="mr-2">{{ row.detailsShowing ? 'less' : 'more...'}}</b-button>
				</b-button-group>
			</template>
			<template slot="row-details" slot-scope="row">
				<b-card>
					<b-list-group v-if="Object.keys(row.item.description || {}).length > 0" flush>
						<b-list-group-item v-for="(description, lang) in row.item.description" :key="lang" class="d-flex justify-content-between align-items-start">
							{{ description }}
							<b-badge variant="secondary" pill>{{ lang }}</b-badge>
						</b-list-group-item>
					</b-list-group>
					<b-alert v-else variant="light font-italic" show>no description</b-alert>
				</b-card>
			</template>
		</b-table>

	</b-container>
</template>

<style>
	.datasets-flip-enter-active {
		transition: all .5s ease;
	}
	.datasets-flip-leave-active {
		transition: all .3s ease-in;
		position: absolute;
		/*
		width: 0px;
		height: 0px;
		*/
		/* display: none; */
		/* visibility: collapse; */
	}
	.datasets-flip-enter, .datasets-flip-leave-to {
		transform: translateX(10px);
		opacity: 0;
	}
	.datasets-flip-move {
		transition: transform 0.5s;
	}
	.datasets-highlighted-row {
		/* background: yellow; */
		color: darkgoldenrod;
	}
	.new-record {
		margin-left: auto;
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
	{ label: "published",   key: "published",          sortable: false },
	//	{ label: "id",          key: "id",                 sortable: true },
	{ label: "title",       key: "title",              sortable: true, formatter: 'preferredLanguage' },
	//{ label: "owner",       key: "owner",              sortable: true },
	{ label: "created",     key: "created",            sortable: true, formatter: 'friendlyDate' },
	{ label: "state",       key: "preservation_state", sortable: false },
	{ label: "actions",     key: "actions",            sortable: false },
]

/*
The preservation state is one of the following integers:
0 = Initialized
10 = Proposed for digital preservation
20 = Technical metadata generated
30 = Technical metadata generation failed
40 = Invalid metadata
50 = Metadata validation failed
60 = Validated metadata updated
70 = Valid metadata
80 = Accepted to digital preservation
90 = in packaging service
100 = Packaging failed
110 = SIP sent to ingestion in digital preservation service
120 = in digital preservation
130 = Rejected in digital preservation service
140 = in dissemination
*/

function getApiError(error) {
	let apiError = "api error"
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


// apiProvider fills the table with datasets from an (real or fake) API response.
// Function is passed (ctx, callback).
function apiProvider() {
	let promise = process.env.VUE_APP_ENVIRONMENT !== 'development' ? apiClient.get("/datasets/") : fakeClient()
	this.error = null
	return promise.then((response) => {
		console.log("api count:", (response.data || []).length)
		return (response.data || [])
	})
		.catch((error) => {
			this.error = getApiError(error)
			return []
		})
}

export default {
	name: "dataset-list",
	data() {
		return {
			activeInModal: null,
			fields: fields,
			ownerSelect: null,
			filterString: null,
			myGroupsOptions: [],
			showDatasetState: {
				draft: true,
				published: true,
			},
			isBusy: false,
			error: null,
			//highlighted: "0582f51d-86c3-2bc1-eb11-296b533b9731",
			devWarning: process.env.VUE_APP_ENVIRONMENT === 'development' && !process.env.VUE_APP_QVAIN_API_URL,
			datasetList: [],
		}
	},
	methods: {
		// apiProvider fills the table with datasets from an (real or fake) API response.
		// Function is passed (ctx, callback).
		apiProvider(ctx) {
			return apiProvider.bind(this)(ctx)
		},
		async fetchDataset() {
			try {
				this.error = null
				const { data } = await (process.env.VUE_APP_ENVIRONMENT === 'development' && !process.env.VUE_APP_QVAIN_API_URL ?
					fakeFetch(testList, 500) : apiClient.get("/datasets/"))

				console.log("api count:", data.length)
				this.datasetList = data
			} catch (e) {
				this.error = getApiError(e)
				this.datasetList = []
			}
		},
		open(id) {
			console.log("request to open dataset", id)
			this.$router.push({ name: 'tab', params: { id: id, tab: 'description' }})
		},
		del(id) {
			this.error = null
			apiClient.delete("/datasets/" + id)
				.then((response) => {
					// returns 204 or 200
					this.$root.showAlert("successfully deleted dataset", "success")
					this.$refs.datasetTable.refresh()
				})
				.catch((error) => {
					this.error = getApiError(error)
				})
		},
		view(extid) {
			console.log("opening:", `{process.env.VUE_APP_ETSIN_API_URL}/{extid}`)
			window.open(`${process.env.VUE_APP_ETSIN_API_URL}/${extid}`, '_blank')
		},
		friendlyDate: function(iso) {
			return distanceInWordsToNow(iso)
		},
		readableIso: function(iso) {
			return formatDate(iso, "YYYY-MM-DD HH:mm:ss")
		},
		preferredLanguage: function(langObj) {
			if (typeof langObj === "string") {
				return langObj
			}
			else if (typeof langObj !== "object" || langObj === null) {
				return "–"
			}
			return langObj[this.$root.language] || langObj['en'] || langObj['fi'] || langObj['se'] || langObj[Object.keys(langObj)[0]] || ""
		},
		filter: function(item) {
			return this.filterState(item) && this.filterTitles(item)
		},
		filterState: function(item) {
			// both or none
			if (this.showDatasetState.draft === this.showDatasetState.published) return this.showDatasetState.draft
			return this.showDatasetState.draft ? !item.published : item.published
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
		fetch: function(source) {
			this.toggleSource(source)
		},
		toggleDetails(id, row) {
			row.toggleDetails()
		},
		refresh() {
			this.$refs.datasetTable.refresh()
		},
		rowClass(item, type) {
			if (!item) return
			//if (!this.highlighted) return
			/*
			if (item.id === this.highlighted) {
				return 'datasets-highlighted-row'
			}
			*/
			if ('#' + item.id === this.$route.hash) {
				console.log("highlighted", item.id)
				//return 'datasets-highlighted-row'
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
		filterRegExp: function() {
			return new RegExp('.*' + this.filterString + '.*', 'ig')
		},
	},
	components: {
		PreservationState,
		BusyButton,
		DatasetVersionsModal,
	},
	async created() {
		this.ownerSelect = this.$auth.user.id
		await this.fetchDataset()
	},
}
</script>
