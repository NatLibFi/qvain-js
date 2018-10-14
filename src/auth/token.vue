<template>
	<div class="mt-3">
		<div v-if="!error">
			<b-alert variant="success" show><font-awesome-icon icon="circle-notch" spin fixed-width/> logging in...</b-alert>
			<div class="m-3"> <!-- col-6 offset-3 -->
				<h5 class="mb-3" v-if="false">user info</h5>

				<dl v-if="$auth.loggedIn" class="row">
					<dt class="col-sm-2">id</dt>
						<dd class="col-sm-10">{{ $auth.user.id }}</dd>
					<dt class="col-sm-2">name</dt>
						<dd class="col-sm-10">{{ $auth.user.name }}</dd>
					<dt class="col-sm-2">email</dt>
						<dd class="col-sm-10">{{ $auth.user.email }}</dd>
				</dl>
			</div>
		</div>
		<div v-else>
			<b-alert variant="danger" show><b>error:</b> {{ error }}</b-alert>
			<div class="m-3">
				<p class="font-italic">not logged in</p>

				<b-input-group prepend="token">
					<b-form-input v-model="tokenInput"></b-form-input>
					<b-input-group-append>
						<b-btn @click="login()">submit</b-btn>
					</b-input-group-append>
				</b-input-group>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "token-login",
	data: () => {
		return {
			//token: null,
			tokenInput: process.env.VUE_APP_DEV_TOKEN || null,
			error: null,
		}
	},
	methods: {
		login() {
			this.$auth.login(this.tokenInput)
			this.$router.push(this.$route.query.redirect || "/")
		},
	},
	computed: {
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
		// logged in already; but don't redirect: token might be invalid, so read new token
		/*
		if (this.$auth.loggedIn) {
			this.$router.push(this.$route.query.redirect || "/")
		}
		*/
		// got token, login and redir if successful
		//console.log("token:", this.token)
		if (this.token && this.$auth.login(this.token)) {
			//console.log("token was valid!")
			this.error = null
			let vm = this
			setTimeout(function() {
				vm.$router.push('/')
			}, 3000)
		} else {
			this.error = this.token ? "invalid login token" : "no token received"
		}
	},
}
</script>
