<template>
	<div class="container-fluid my-4">
		<h2>Fairdata dataset schema</h2>
		<ul class="nav nav-tabs">
			<!-- TODO: errors could be shown in tabs also -->
			<li v-for="tab in tabs" class="nav-item">
				<router-link class="nav-link" :to="`/new/${tab.uri}`">{{tab.label}}</router-link>
			</li>
		</ul>
		<router-view></router-view>
	</div>
</template>

<script>
export default {
  name: 'tabui',
  computed: {
    tabs() {
      return this.$store.state.hints.tabs || ['metadata']
    },
  },
}
</script>
<style>
.nav-tabs .nav-link.active,
.nav-tabs .nav-link.router-link-active,
.nav-tabs .nav-item.show .nav-link {
  color: #495057;
  background-color: #fff;
  border-color: #dee2e6 #dee2e6 #fff;
}
</style>