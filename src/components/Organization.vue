<template>
	<div>
		<b-form-group label="Identifier" label-for="identifier">
			<b-form-input id="identifier" type="text" v-model="organization.identifier" required placeholder="Enter identifier"></b-form-input>
		</b-form-group>

		<!-- TODO: replace name with object containing language codes -->
		<b-form-group id="exampleInputGroup2" label="Your Name:" label-for="exampleInput2">
			<b-form-input id="exampleInput2" type="text" v-model="organization.name" required placeholder="Enter name"></b-form-input>
		</b-form-group>

		<b-form-group id="exampleInputGroup1" label="Email address:" label-for="exampleInput1" description="Enter email">
			<b-form-input id="exampleInput1" type="email" v-model="organization.email" required placeholder="Enter email"></b-form-input>
		</b-form-group>
	</div>
</template>

<script>

import Agent from './Agent.vue';
import Organization from './Organization';

export default {
	name: 'organization',
	model: {
		prop: 'organization',
		event: 'input'
	},
	props: {
		organization: {
			type: Object,
			required: true
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
