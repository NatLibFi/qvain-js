<template>
	<div>
		<h2>orcid search</h2>

		<p>Look up public information for an orcid</p>

		<dl>
			<dt>epk</dt>
			<dd>https://orcid.org/0000-0002-4411-8452</dd>
			<dt>wvh</dt>
			<dd>https://orcid.org/0000-0001-7695-4511</dd>
			<dt>jpve</dt>
			<dd>https://orcid.org/0000-0003-4460-3906</dd>
		</dl>

		<b-row>
		<b-col cols="6">

		<b-form-group
		id=""
		description="ORCID lookup"
		label="Enter your orcid"
		label-for="orcid-input"
		:invalid-feedback="invalidFeedback"
		:valid-feedback="validFeedback"
		:state="state"
		>
			<b-input-group>
				<b-input-group-text slot="prepend">
				<strong>orcid</strong>
				</b-input-group-text>
				<b-input-group-text slot="prepend" class="bg-white border-right-0 pr-1">
				https://orcid.org/
				</b-input-group-text>
				<b-form-input id="orcid-input" title="orcid" type="text" pattern="\d{4}-\d{4}-\d{4}-\d{4}" v-model="orcid" :state="state" placeholder="0000-0001-2345-6789" class="embedded-input pl-1" @focus.native="resetError" @keyup.enter.native="get('person')" @keypress.native="filterKeys"></b-form-input>
				<b-input-group-append>
				<b-btn :variant="error ? 'danger' : 'dark'" @click="get('person')">PERSON</b-btn>
				<b-btn :variant="error ? 'danger' : 'dark'" @click="get('record')">RECORD</b-btn>
				</b-input-group-append>
			</b-input-group>
		</b-form-group>

		</b-col>
		</b-row>

		<p>
		<strong>first name:</strong> {{ this.firstName }}<br/>
		<strong>last name:</strong> {{ this.lastName }}<br/>
		<strong>full name:</strong> {{ this.fullName }} <span class="text-muted">(computed)</span><br/>
		<strong>last, first:</strong> {{ this.lastFirstName }} <span class="text-muted">(computed)</span><br/>
		</p>

		<pre v-if="result">
			{{ result }}
		</pre>
	</div>
</template>

<style>
.embedded-input {
	border-left: 1px solid transparent;
	border-right: 1px solid transparent;
}
</style>

<script>
import client from './api.js'

// pre-compile
const reOrcid = new RegExp('^\\d{4}-\\d{4}-\\d{4}-\\d{4}$')

export default {
	name: 'orchid-search',
	data: function() {
		return {
			orcid: "",
			result: null,
			error: null,
			busy: false,
			firstName: "",
			lastName: "",
		}
	},
	methods: {
		get: function(resource) {
			if (!this.orcid) return

			this.error = null
			this.busy = true
			let vm = this
			client(this.orcid, resource)
				.then(response => {
					console.log("success!", response.data)
					vm.result = response.data
				})
				.catch(error => {
				// Error: Request failed with status code 404
					console.log(error)
					if (error.response) {
						if (error.response.status == 404) {
							this.error = "not found"
							return
						}
					}
					this.error = error.message
				})
			this.busy = false
		},
		resetError: function(e) {
			console.log("reset:", e)
			this.error = null
		},
		resetData: function() {
			this.firstName = ""
			this.lastName = ""
		},
		filterKeys (e) {
			e = (e) ? e : window.event
			if ((e.keyCode < 48 || e.keyCode > 57) && e.keyCode != 45) {
				console.log("bad key:", e.keyCode)
				e.preventDefault()
			} else {
				return true
			}
		},
	},
	computed: {
		isValidOrcid () {
			return this.orcid.length == 19 && reOrcid.test(this.orcid)
		},
		state () {
			return !this.orcid ? null : !this.error && this.isValidOrcid
		},
		invalidFeedback () {
			if (this.error) {
				return "orcid api error: " + this.error
			} else if (this.orcid.length > 19) {
				return 'That looks a bit long for an orcid...'
			} else if (this.orcid.length == 19) {
				return 'That does not look like a valid orcid!'
			} else if (this.orcid.length > 0) {
				return 'A bit more!'
			} else {
				return ''
			}
		},
		validFeedback () {
			return this.state ? 'That looks about right!' : ''
		},
		fullName() {
			return this.firstName + ' ' + this.lastName
		},
		lastFirstName() {
			return this.firstName ?
				this.lastName + ", " + this.firstName :
				this.lastName
		},
	},
	watch: {
		result () {
			if (!this.result || typeof this.result !== 'object' || !('name' in this.result)) {
				this.resetData
				return
			}
			this.firstName = this.result.name['given-names'] && this.result.name['given-names']['value'] || ''
			this.lastName = this.result.name['family-name'] && this.result.name['family-name']['value'] || ''
		},
	},
	created() {},
}
</script>
