<template>
	<b-container fluid>
		<div class="mx-2 my-3 row">
			<b-button-toolbar aria-label="dataset list toolbar">
				<b-button-group size="sm" class="mx-1">
					<b-btn v-b-tooltip.hover.bottom title="create new record">new</b-btn>
					<b-btn v-b-tooltip.hover.bottom title="edit a record">edit</b-btn>
				</b-button-group>

				<b-input-group size="sm" class="mx-1" prepend="owner">
					<b-form-select v-model="ownerSelect" v-b-tooltip.hover.bottom title="select record owner" style="min-width: 12rem;">
						<template slot="first">
							<option :value="$auth.user.id" selected>myself</option>
						</template>
						<optgroup label="groups" v-if="myGroupsOptions.length">
							<option v-for="(option, idx) in myGroupsOptions" :value="option.value" :disabled="option.disabled" :key="`option_${idx}_opt`" v-html="option.text"></option>
						</optgroup>
					</b-form-select>
					<b-input-group-append>
						<b-btn :pressed.sync="recordSource['local']" @click="fetch('local')" v-b-tooltip.hover.bottom title="show in-progress records">in progress</b-btn>
						<b-btn :pressed.sync="recordSource['metax']" @click="fetch('metax')" v-b-tooltip.hover.bottom title="show records awaiting approval">published</b-btn>
					</b-input-group-append>
				</b-input-group>

				<b-input-group size="sm" class="mx-1" left="search" v-b-tooltip.hover.bottom title="search titles">
					<b-form-input v-model="filterString" placeholder="title" />
				</b-input-group>

				<busy-button size="sm" v-if="false">save</busy-button>

			</b-button-toolbar>
		</div>

		<b-alert variant="danger" ref="datasetErrorAlert" :show="!!error" dismissible @dismissed="error = null">{{ error }}</b-alert>

		<dataset-versions-modal :dataset="activeInModal"></dataset-versions-modal>

		<b-table id="dataset-list" ref="datasetTable" class="m-1" tbody-class="dataset-list" striped hover show-empty :items="apiProvider" :fields="fields" :filter="filterTitles" no-provider-filtering :busy.sync="isBusy">
			<template slot="owner" slot-scope="data">
				<span v-b-tooltip.hover.auto :title="data.item.uid">{{ data.item.owner }}</span>
			</template>
			<template slot="preservation_state" slot-scope="data">
				<preservation-state v-if="data.item.state" :state="data.item.state">state</preservation-state>
				<preservation-state :state="data.item.preservation_state">state</preservation-state>
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
					<b-button size="sm" @click.stop="open(row.item.id)">open</b-button>
					<b-button size="sm" v-b-modal="'dataset-versions-modal'" @click="activeInModal = row.item.id" :disabled="row.item.versions < 1">versions</b-button>
					<b-button size="sm" variant="danger" @click.stop="del(row.item.id)">delete</b-button>
					<b-button size="sm" @click.stop="toggleDetails(row.item.id, row)" class="mr-2">{{ row.detailsShowing ? 'less' : 'more'}}</b-button>
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
	.dataset-list-enter, .dataset-list-leave-active {
		display: none;
		/* transition: all 1s; */
		/* transition: fade 1s; */
		transition: fade 1s;
	}
	.dataset-list-enter-active {
		transition: transform 0.5s;
	}
	.dataset-list-move {
		transition: transform 0.5s;
	}
</style>

<script>
import apiClient from '@/api/client.js'
import PreservationState from '@/components/PreservationState.vue'
import BusyButton from '@/components/BusyButton.vue'
import DatasetVersionsModal from '@/components/VersionsModal.vue'

import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import formatDate from 'date-fns/format'

// id owner created modified published identifier title{} description{} preservation_state

const fields = [
	{ label: "id",          key: "id",                 sortable: true },
	{ label: "title",       key: "title",              sortable: true, formatter: 'preferredLanguage' },
	{ label: "owner",       key: "owner",              sortable: true },
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

function apiProvider(ctx) {
	let promise = apiClient.get("/datasets/")

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
	data: function() {
		return {
			activeInModal: null,
			fields: fields,
			ownerSelect: null,
			filterString: null,
			myGroupsOptions: [],
			recordSource: {
				local: false,
				metax: false,
			},
			isBusy: false,
			error: null,
		}
	},
	methods: {
		open(id) {
			this.$router.push({ name: 'editor', params: { id: id }})
		},
		del(id) {
			this.error = null
			apiClient.delete("/datasets/" + "05747df84d5a24ef3ca8d9cffb428de2")
				.then((response) => {
					// returns 204 or 200
					vm.$root.showAlert("successfully deleted dataset", "success")
					vm.$refs.datasetTable.refresh()
				})
				.catch((error) => {
					this.error = getApiError(error)
				})
		},
		apiProvider(ctx) {
			return apiProvider.bind(this)(ctx)
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
			return langObj[this.$root.language] || langObj['en'] || langObj['fi'] || langObj['se'] || ""
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
		toggleSource: function(source) {
			Object.keys(this.recordSource).forEach(x => this.recordSource[x] = x === source)
		},
		toggleDetails(id, row) {
			row.toggleDetails()
		},
		refresh() {
			this.$refs.datasetTable.refresh()
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
	created: function() {
		this.ownerSelect = this.$auth.user.id
	},
}
</script>
