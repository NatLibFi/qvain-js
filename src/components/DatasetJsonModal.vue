<template>
	<b-modal size="lg" lazy ok-only title="Dataset JSON representation" v-bind="$attrs" v-on="$listeners">
		<b-form-textarea id="dataset-json-modal-json" class="p-0 text-monospace small" plaintext readonly :value="JSON.stringify($store.getters.prunedDataset, null, 2)" placeholder="no json" :rows="12" :max-rows="24"></b-form-textarea>
	</b-modal>
</template>
