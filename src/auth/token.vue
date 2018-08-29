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
			<div v-else>
				<p>not logged in (loggedIn: {{ $auth.loggedIn }})</p>
				<b-input-group prepend="token">
					<b-form-input v-model="tokenInput"></b-form-input>
					<b-input-group-append>
						<b-btn @click="login()">submit</b-btn>
					</b-input-group-append>
				</b-input-group>
			</div>

	</div>
</template>

<script>
export default {
	name: "token-login",
	data: () => {
		return {
			//token: null,
			tokenInput: null,
		}
	},
	methods: {
		login() {
			this.$auth.login(this.tokenInput)
			this.$router.push(this.$route.query.redirect || "/")
		},
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
		// logged in already, redir
		if (this.$auth.loggedIn) {
			this.$router.push(this.$route.query.redirect || "/")
		}
		// got token, login and redir if successful
		if (this.token && this.$auth.login(this.token)) {
			var vm = this
			setTimeout(function() {
				vm.$router.push('/')
			}, 3000)
		}
		if (process.env.VUE_APP_DEV_TOKEN) {
			this.tokenInput = process.env.VUE_APP_DEV_TOKEN
		}
	},
}
</script>
