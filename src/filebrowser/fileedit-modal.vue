<template>
  <b-modal id="actual-fileedit-modal" ref="actual-fileinfo-modal" @hide="reset" title="Set metadata">
    <b-form-group class="my-1" :label="item.label" v-for="(item, i) in editable" :key="item.label" horizontal :lable-for="'input' + i">
      <b-form-input :id="'input' + i" :placeholder="item.label" v-model.trim="item.value"></b-form-input>
    </b-form-group>
    <RefList esDoctype="use_category" placeholder="use category" help="help" uiLabel="Use category" />
  </b-modal>
</template>

<script>
import RefList from '../widgets/refdata/list-ui'

const isFile = item => {
  return typeof item === 'object' && typeof item.file_name === 'string'
}

export default {
  name: 'fileedit-modal',
  props: {},
  data: function() {
    return {
      apiData: null,
      editable: [],
    }
  },
  methods: {
    show: function(item) {
      this.apiData = item
      // TODO: define fields to display here for files and for folders
      // currently it gets fields from file characteristics, but folders don't have that
      // in tietomalli/mrd you can see that folders also have a title and a description
      // which both are provided by the user.

      // fields in mrd:
      // title
      // description
      // use_category
      // access_url
      // file_type

      // how are these fields made?
      const addEditable = (label, value) => {
        this.editable.push({ label, value })
      }
      if (isFile(item)) {
        if (typeof item['file_characteristics'] === 'object') {
          let chars = item['file_characteristics']
          chars['title'] && addEditable('Title', chars['title'])
          chars['description'] &&
            addEditable('Description', chars['description'])
          chars['encoding'] && addEditable('Encoding', chars['encoding'])
          item['file_format'] && addEditable('Format', chars['file_format'])
        }
      } else {
        addEditable('Title')
        addEditable('Description')
      }
      this.$refs['actual-fileinfo-modal'].show()
    },
    reset: function() {
      this.apiData = null
      this.editable = []
    },
    save: function() {
      // TODO: how is this data saved? In what fields will it be saved?
      // Directories can also have a description and title for example
    },
  },
  computed: {},
  components: {
    RefList,
  },
  created: function() {},
}
</script>
