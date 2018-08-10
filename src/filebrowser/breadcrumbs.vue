<template>
  <ol class="breadcrumb m-0 bg-white">
    <b-btn class="m-0 py-0 px-2" variant="link" @click.stop="click(homePath)" v-if="homePath">
      <i class="fas fa-home"></i>
    </b-btn>
    <li class="breadcrumb-item" v-for="(crumb, i) in breadcrumbs">
      <b-btn v-if="crumb.label" class="m-0 py-0 px-2" variant="link" @click.stop="click(crumb.to ? crumb.to : '/')" :disabled="i === breadcrumbs.length -1">
        {{crumb.label}}
      </b-btn>
    </li>
  </ol>
</template>

<script>
export default {
  name: 'breadcrumbs',
  props: ['breadcrumbs', 'click', 'homePath'],
  updated: function() {
    console.log('breadcrumbs:', this.breadcrumbs)
  },
}
</script>

<style>
</style>
