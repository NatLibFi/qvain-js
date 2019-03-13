<template>
	<b-modal size="lg" ok-only title="Publish: error" v-bind="$attrs" v-on="$listeners">
		<p class="mb-1">Some error happened. Too bad. Sucks for you.</p>
		<p class="mb-1" v-if="isValidationError">The upstream service isn't happy with the provided data. Most likely a required field is missing.</p>
		<p class="mb-1" v-if="extErrorId">The external service returned error identifier: <code class="text-info bg-light p-1">{{ extErrorId }}</code></p>
		<p>
			<b-button v-b-toggle="'publish-modal-error-collapse'" variant="link" size="sm" class="p-0 m-0 small" v-if="error.more">Show details &gt;</b-button>
		</p>
		<b-collapse id="publish-modal-error-collapse" class="mt-2" style="height: 200px;">
			<b-form-textarea id="publish-modal-error-json" class="p-0 text-monospace small" plaintext readonly :value="JSON.stringify(error.more, null, 2)" placeholder="no error" :rows="8" :max-rows="16"></b-form-textarea>
		</b-collapse>
	</b-modal>
</template>

<script>
const fakeValidationError = {
	status: 400,
	msg: "publish error",
	origin: "metax",
	more: {"research_dataset":["{} does not have enough properties. Json path: ['title']. Schema: {'type': 'object', 'minProperties': 1, 'title': 'Multilingual string', 'description': 'Object type for localized strings', 'additionalProperties': {'minLength': 1, 'type': 'string'}}"],"error_identifier":"2019-03-08T12:08:09-7dc7ab7a"},
}

export default {
	name: 'PublishModal',
	props: {
		error: {
			type: Object,
			default: () => { return fakeValidationError },
		},
	},
	data() {
		return {
		}
	},
	computed: {
		extError() {
			return this.error && this.error.more || null
		},
		extErrorId() {
			return this.extError && this.extError["error_identifier"]
		},
		isValidationError() {
			return !!(this.extError && this.extError["research_dataset"])
		},
	},
}
</script>
