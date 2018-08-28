<template>
  <div class="my-2">
    <FileEditModal ref="refFileEditModal"></FileEditModal>
    <div class="px-2 py-2 d-flex justify-content-between">
      <h3>Selected items</h3>
    </div>
    <b-card v-if="!data || data.length === 0" class="text-center bg-light">No files added</b-card>
    <b-card v-else no-body>
      <div v-for="category in data">
        <SingleObject :key="single.identifier" :single="single" v-for="single in category.data"
          :type="category.type" :title="getTitle(single.identifier)"
          :secondary="single.identifier" :icon="icons[category.type]" :removeItem="() => removeItem(single.identifier, category.type)"
          :openModal="() => modalOpen(single)" />
      </div>
    </b-card>
  </div>
</template>

<script>
import FileEditModal from './fileedit-modal.vue'
import SingleObject from './single-object.vue'
import { faFile, faFolder } from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'SelectedFiles',
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
      // TODO: change to action
      this.$store.commit('files/removeItem', {identifier: id, type})
    },
    modalOpen: function() {
      console.log('data', this.data)
      return this.$refs.refFileEditModal.show.apply(this, arguments)
    },
    getTitle: function(id) {
      return this.$store.state.files.namesOfSelected[id]
    }
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