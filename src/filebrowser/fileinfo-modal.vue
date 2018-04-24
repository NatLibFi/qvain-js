<template>
	<b-modal id="actual-fileinfo-modal" ref="actual-fileinfo-modal" size="lg" title="file info" cancel-title="cancel" ok-title="close" @ok="save()" @show="open()" :cancel-disabled="true" ok-only>
		<!-- fileinfo modal -->
		<template slot="modal-title">
			<i class="fa fa-angle-right" aria-hidden="true"></i> <span v-if="true">file info: <span v-if="fileProject">{{ fileProject }}: </span>{{ filePath }}</span><span v-else><i>file info</i></span>
		</template>
		
		<b-alert variant="success" :show="apiResponse !== null">Success Alert</b-alert>
		<b-alert variant="danger" :show="apiError !== null">{{ apiError }}</b-alert>
		<b-form-textarea id="modal-textarea" v-model="apiResponse" placeholder="api response" :rows="6" :max-rows="24" :state="apiState" readonly></b-form-textarea>
	</b-modal>
</template>

<script>
import axios from 'axios'
const METAX_FILE_URL = "https://metax-test.csc.fi/rest/files/"

export default {
	name: 'fileinfo-modal',
	props: {},
	data: function() {
		return {
			fileId: null,
			filePath: null,
			fileProject: null,
			apiResponse: null,
			apiError: null,
		}
	},
	methods: {
		show: function(id, path, project) {
			console.log("modal called for file:", id)
			this.fileId = id
			this.filePath = path
			this.fileProject = project
			this.$refs['actual-fileinfo-modal'].show()
		},
		open: function() {
			const vm = this
			
			axios.get(METAX_FILE_URL + this.fileId, {
			//axios.get(METAX_FILE_URL + 666, {
				transformResponse: (req) => { return JSON.stringify(req, null, 2) },
				responseType: 'json'
			})
				.then(function (response) {
					console.log("status:", response.status)
					vm.apiResponse = response.data
					vm.apiError = null
				})
				.catch(function (error) {
				/*
				if (error.response) {
					// The request was made and the server responded with a status code
					// that falls out of the range of 2xx
					// console.log(error.response.data);
					// console.log(error.response.status);
					// console.log(error.response.headers);
				} else if (error.request) {
					// The request was made but no response was received
					// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
					// http.ClientRequest in node.js
					console.log(error.request);
				} else {
					// Something happened in setting up the request that triggered an Error
					console.log('Error', error.message);
				}
				*/
					console.log(error)
					vm.apiResponse = error.response || null
					vm.apiError = error.message
				})
		},
		save: function() {
		},
	},
	computed: {
		apiState: function() {
			//console.log("apiState:", this.apiResponse, this.apiError, this.apiResponse === null && this.apiError === null ? null : !!(this.apiResponse && !this.apiError))
			return this.apiResponse === null && this.apiError === null ? null : !!(this.apiResponse && !this.apiError)
		},
	},
	created: function() {},
}
</script>
