<template>
	<div>
		<p>message: {{ message }}</p>
	</div>
</template>

<script>
export default {
	name: "token-login",
	data: () => {
		return {}
	},
	computed: {
		message() {
			return this.$route.hash ? `logging in... hash: |${this.$route.hash}|` : "no token"
		},
	},
}	
</script>
