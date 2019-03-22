<template>
  <ol class="breadcrumb m-0 bg-white">
    <b-btn class="m-0 py-0 px-2" variant="link" @click.stop="click(homePath)" v-if="homePath">
      <font-awesome-icon :icon="icon.faHome" />
    </b-btn>
    <li class="breadcrumb-item" v-for="(crumb, i) in breadcrumbs" :key="i">
      <b-btn v-if="crumb.label" class="m-0 py-0 px-2" variant="link" @click.stop="click(crumb.to ? crumb.to : '/')" :disabled="i === breadcrumbs.length -1">
        {{crumb.label}}
      </b-btn>
    </li>
  </ol>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'

export default {
	name: 'breadcrumbs',
	props: ['breadcrumbs', 'click', 'homePath'],
	data: function() {
		return {
			icon: { faHome },
		}
	},
	updated: function() {
	},
	components: {
		FontAwesomeIcon,
	},
}
</script>

<style>
</style>
