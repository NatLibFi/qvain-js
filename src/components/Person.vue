<template>
	<b-form>
		<b-form-group id="exampleInputGroup2" label="Your Name:" label-for="exampleInput2">
			<b-form-input id="exampleInput2" type="text" v-model="person.name" required placeholder="Enter name"></b-form-input>
		</b-form-group>

		<b-form-group id="exampleInputGroup1" label="Email address:" label-for="exampleInput1" description="Enter email">
			<b-form-input id="exampleInput1" type="email" v-model="person.email" required placeholder="Enter email"></b-form-input>
		</b-form-group>
	</b-form>
</template>

<script>

export default {
	name: 'person',
	data() {
		return {
			person: {
				identifier: '',
				name: '',
				email: '',
				phone: ''
			}
		}
	},
	methods: {

	},
	computed: {

	},
	created() {
		// Alternative implementation: get fields from schema, does not solve the problem of complicated schema
	}
}
</script>

<style lang="scss" scoped>

</style>
