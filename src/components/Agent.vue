<template>
	<b-modal size="lg" id="modal1" title="Add object" :visible="value" @input="e => $emit('input', e)" @ok="e => $emit('ok', e)">
		<div class="mb-5">
			<p>Select the type of object</p>
			<b-form-select  v-model="selectedType" :options="options" />
		</div>
		<Person v-if="selectedType === 'person'" />
		<Organization v-if="selectedType === 'organization'" />
	</b-modal>
</template>

<script>

import Person from './Person.vue';
import Organization from './Organization';

export default {
	name: 'agent',
	components: {
		Person,
		Organization,
	},
	props: {
		value: {
			type: Boolean, // the control to show modal
		},
	},
	data() {
		return {
			selectedType: null,
			options: [
				{ value: null, text: 'Select type of the Agent' },
				{ value: 'person', text: 'Person' },
				{ value: 'organization', text: 'Organization' }
			]
		}
	},
	methods: {

	},
	computed: {

	},
}
</script>

<style lang="scss" scoped>

</style>
