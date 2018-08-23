<template>
  <div class="my-2">
    <FileEditModal ref="refFileEditModal"></FileEditModal>
    <div class="px-2 py-2 d-flex justify-content-between">
      <h3>Selected items</h3>
      <!-- This should not be shown with displaying selected files and folders -->
      <!-- <b-btn>Button</b-btn> -->
    </div>
    <b-card v-if="!data || data.length === 0" class="text-center bg-light">No files added</b-card>
    <b-card v-else no-body>
      <div v-for="category in data">
        <SingleObject :key="single.identifier" :single="single" v-for="single in category.data"
          :type="category.type" :title="category.type === 'file' ? single.file_name : single.directory_name"
          :secondary="single.identifier" :icon="icons[category.type]" :removeItem="() => removeItem(single.identifier, category.type)"
          :openModal="() => modalOpen(single)" />
      </div>
    </b-card>
  </div>
</template>

<script>
import FileEditModal from '../fileedit-modal.vue'
import SingleObject from './single-object.vue'
import { faFile, faFolder } from '@fortawesome/free-regular-svg-icons'

export default {
  name: 'object-array',
  props: ['title', 'data'],
  data: function() {
    return {
      icons: {
        file: faFile,
        dir: faFolder,
      },
    }
  },
  methods: {
    removeItem: function(id, type) {
      type === 'file'
        ? this.$store.commit('files/removeFile', id)
        : this.$store.commit('files/removeDir', id)
    },
    modalOpen: function() {
      console.log('data', this.data)
      return this.$refs.refFileEditModal.show.apply(this, arguments)
    },
  },
  computed: {},
  watch: {},
  components: {
    SingleObject,
    FileEditModal,
  },
  created: function() {
    console.log('data in objectarray', this.data)
  },
}
</script>