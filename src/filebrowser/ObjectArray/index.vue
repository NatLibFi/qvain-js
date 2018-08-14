<template>
  <div class="my-2">
    <div class="px-2 py-2 d-flex justify-content-between">
      <h3>Selected items</h3>
      <!-- This should not be shown with displaying selected files and folders -->
      <!-- <b-btn>Button</b-btn> -->
    </div>
    <b-card v-if="!data || data.length === 0" class="text-center bg-light">No files added</b-card>
    <b-card v-else no-body>
      <div v-for="category in data">
        <SingleObject v-for="single in category.data" :title="category.type === 'file' ? single.file_name : single.directory_name" :secondary="single.identifier" :icon="icons[category.type]"></SingleObject>
      </div>
    </b-card>
  </div>
</template>
<script>
import SingleObject from './single-object.vue'

export default {
  name: 'object-array',
  props: ['title', 'data'],
  data: function() {
    return {
      icons: {
        file: "fas fa-file",
        dir: "fas fa-folder",
      }
    }
  },
  methods: {},
  computed: {
  },
  watch: {},
  components: {
    SingleObject,
  },
  created: function() {},
}
</script>