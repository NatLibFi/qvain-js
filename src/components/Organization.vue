<template>
	<div>


	</div>
</template>

<script>

import Agent from './Agent.vue';
import Organization from './Organization';

export default {
	name: 'organization',
	data() {
		return {
			showAddObjectModal: false,
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
