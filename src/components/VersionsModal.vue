<template>
	<b-modal id="dataset-versions-modal" ref="dataset-versions-modal" size="lg" centered @shown="fetch(dataset)" @hide="reset" title="published versions" ok-only ok-title="close">
		<b-alert variant="danger" :show="!!error">API error: {{ error }}</b-alert>
		<h5 slot="modal-title" class="modal-title"><font-awesome-icon icon="history" fixed-width/> Published versions</h5>

		<b-list-group v-if="versions.length">
			<b-list-group-item class="flex-column align-items-left" :disabled="index + 1 < versions.length" v-for="(item, index) in versions" :key="index">
				<header class="d-flex align-items-start w-100 justify-content-between">
					<h5 class="font-weight-bold">
					<b-badge v-if="false" variant="secondary" class="p-1 mr-1 font-weight-light"><font-awesome-icon icon="database" fixed-width /> metax</b-badge>
					{{ item.identifier }}</h5>
					<b-badge :variant="index + 1 < versions.length ? 'secondary' : 'primary'">v{{ index + 1 }}</b-badge>
				</header>
				<p class="mb-4 mt-0"><small class="font-weight-light"><font-awesome-icon icon="clock" fixed-width class="text-dark" /> {{ readableIso(item.date_created) }} ({{ friendlyDate(item.date_created) }} ago)</small></p>

				<b-badge variant="secondary" class="p-1 mr-1 font-weight-light"><font-awesome-icon icon="database" fixed-width /> metax</b-badge>
				<b-badge variant="secondary" class="p-1 mr-1 font-weight-light" v-if="item.removed"><font-awesome-icon icon="trash" fixed-width class="text-danger" /> removed</b-badge>
				<b-badge variant="secondary" class="p-1 mr-1 font-weight-light" v-if="index + 1 < versions.length"><font-awesome-icon icon="pen" fixed-width class="text-danger" /> read-only</b-badge>
			</b-list-group-item>
		</b-list-group>
		<b-alert v-else variant="light" show class="font-italic">no versions found</b-alert>
	</b-modal>
</template>

<script>
import apiClient from '@/api/client.js'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import format from 'date-fns/format'

// TODO: figure out locale of latest date-fns library
//import { en, fi } from 'date-fns/esm/locale'
//import fi from 'date-fns/locale/fi'

export default {
	name: 'dataset-versions-modal',
	props: ['dataset'],
	data: function() {
		return {
			state: "loading",
			versions: [],
			error: null,
		}
	},
	methods: {
		show: function(item, index, button) {
			console.log("modal called for item:", item, index, button, typeof item)
		},
		reset: function() {
			console.log("reset called")
			this.versions = []
			this.error = null
		},
		save: function() {
		},
		fetch(dataset) {
			if (!dataset) {
				return
			}

			let vm = this

			this.versions = []
			vm.error = null

			console.log("calling API for dataset", dataset)
			apiClient.get(`/datasets/${dataset}/versions`)
				.then(response => {
					console.log("reponse:", response.data)
					if (!Array.isArray(response.data)) {
						throw "invalid response from API: expected array"
					}
					vm.versions = response.data.reverse()
				})
				.catch(error => {
					console.log("in catch block", error)
					vm.error = error.response && error.response.data && error.response.data.msg ? error.response.data.msg : (error.message || error || "").toLowerCase()
				})
		},
		friendlyDate: function(iso) {
			// TODO: locale
			//return distanceInWordsToNow(iso, { locale: fi })
			return distanceInWordsToNow(iso)
		},
		readableIso: function(iso) {
			return format(iso, "YYYY-MM-DD HH:mm:ss")
		},
	},
	computed: {
	},
	/*
	watch: {
		dataset: function(newVal, oldVal) {
			if (newVal !== null) {
				this.fetch()
			}
		}
	},
	*/
	created() {
		//console.log(this.dataset)
		//this.fetch()
	},
}
</script>
