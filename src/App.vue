<template>
	<div id="app">
		<Navigation />
		<b-alert no-show>
			This is an alert message.
		</b-alert>

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
