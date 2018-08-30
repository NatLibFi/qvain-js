<template>
  <b-col md="auto" class="p-2 d-flex border-top border-bottom justify-content-end align-items-center ">
    <span class="px-4">{{pickedItems}} items picked</span>
    <b-btn @click.stop="()=> savePicked()" variant="primary" :disabled="pickedItems === 0">add picked</b-btn>
  </b-col>
</template>
<script>
export default {
  name: 'SelectButtons',
  methods: {
    savePicked: function() {
      this.$store.dispatch('files/savePicked')
    },
  },
  computed: {
    pickedItems: function() {
      return this.$store.state.files.pickedItems
    },
  },
}
</script>
