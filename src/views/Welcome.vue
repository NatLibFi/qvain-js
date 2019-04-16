<template>
	<b-jumbotron style="color: rgb(70,70,70); background-color: rgb(231,233,237);" fluid>
		<template slot="header">
			Qvain
		</template>

		<template slot="lead">
			Welcome to Qvain, the Fairdata metadata editor.
		</template>

		<hr class="my-4">

		<b-alert :show="missingCsc" variant="danger">
			Login unsuccessful. Please make sure that you have a valid CSC account.
			If you tried to log in with an external account (for example Haka) you might get this error if your account is not associated with a CSC account.
			Please register a CSC account in <a href="https://sui.csc.fi">https://sui.csc.fi</a>. You can register with or without a Haka account.
		</b-alert>

		<div v-if="!$auth.loggedIn">
			<p>In order to use Qvain, you need to log in using Haka credentials.</p>
			<p><a :href="$auth.loginUrl" class="btn btn-info btn-lg" role="button">Login now!</a></p>
		</div>

		<p v-else><router-link class="btn btn-info btn-lg" to="/dataset/new/description" role="button">Create a new dataset now!</router-link></p>
	</b-jumbotron>
</template>

<script>
export default {
	props: {
		missingCsc: Boolean,
	},
}
</script>
