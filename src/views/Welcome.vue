<template>
	<b-jumbotron style="color: rgb(70,70,70); background-color: rgb(231,233,237);">
		<template slot="header">
			Qvain
		</template>

		<template slot="lead">	
			Welcome to Qvain, the metadata record editor of the ATT project.
		</template slot="lead">

		<hr class="my-4">
		
		<p>To use the metadata editor, you need an account with the ATT project. You can create a local account or log in via Haka.</p>
		<p>With the toolbar above you can <router-link to="/tabui">create a new record</router-link> or <router-link to="/list">list your records</router-link>.</p>
		
		<p><router-link class="btn btn-info btn-lg" to="/tabui" role="button">Create one now!</router-link></p>
	</b-jumbotron>
</template>
