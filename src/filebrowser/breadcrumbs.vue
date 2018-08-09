<template>
  <ol class="breadcrumb m-0 bg-white">
    <li class="breadcrumb-item" v-if="crumb.label" v-for="(crumb, i) in breadcrumbs">
      <b-btn class="m-0 py-0 px-2" variant="link" @click.stop="click(crumb.to)" :disabled="i === breadcrumbs.length -1">{{crumb.label}}</b-btn>
    </li>
  </ol>
</template>

<script>
export default {
  name: 'breadcrumbs',
  props: ['breadcrumbs', 'click'],
}
</script>

<style>
ul {
}
</style>
