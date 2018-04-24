<template>
	<div>
		<i class="fas fa-circle-notch fa-spin fa-w-16"></i>
		<p>message: {{ message }}</p>
		<p>user:</p>
			<dl v-if="$auth.loggedIn">
				<dt>loggedIn</dt><dd>{{ $auth.loggedIn }}</dd>
				<dt>id</dt><dd>{{ $auth.user.id }}</dd>
				<dt>name</dt><dd>{{ $auth.user.name }}</dd>
				<dt>email</dt><dd>{{ $auth.user.email }}</dd>
			</dl>
			<p v-else>not logged in (loggedIn: {{ $auth.loggedIn }})</p>
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
			return this.$route.hash ? `logging in... hash: |${this.$route.hash}| token: ${this.token}` : "no token"
		},
		token() {
			// strip fragment hash
			return this.$route.hash.charAt(0) == '#' ? this.$route.hash.substr(1) : this.$route.hash
		},
		redirTo() {
			// TODO: read query for redirect-to location
			//return this.$route
			return "/"
		},
	},
	created: function() {
		if (this.token && this.$auth.login(this.token)) {
			var vm = this
			setTimeout(function() {
				vm.$router.push('/')
			}, 3000)
		}
	},
}	
</script>
