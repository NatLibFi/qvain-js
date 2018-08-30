<template>
	<div id="app">
		<Navigation />
		<b-container fluid>
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
