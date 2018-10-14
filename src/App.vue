<template>
	<div id="app">
		<navigation />
		<b-container fluid id="app-body">
			<router-view></router-view>
		</b-container>
	</div>
</template>

<script>
import Navigation from './navigation.vue'

export default {
	name: 'App',
	components: {
		Navigation,
	},
}
</script>
