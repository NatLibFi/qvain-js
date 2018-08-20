<template>
  <b-modal id="actual-fileedit-modal" ref="actual-fileinfo-modal" @hide="reset" title="Set metadata">
    <div v-if="item">
      <RefList esDoctype="use_category" placeholder="use category" help="help text" uiLabel="Use category" :value="item.use_category" :setValue="setUseCategory" type="multiselect" :customLabel="(item) => item.label['en'] ? item.label['en'] : item.label.und">
      </RefList>
      <b-form-group class="my-1" label="Title" key="title" horizontal lable-for="title">
        <b-form-input id="title" placeholder="title" v-model.trim="item.file_characteristics.title"></b-form-input>
      </b-form-group>
      <b-form-group class="my-1" label="Description" key="description" horizontal lable-for="description">
        <b-form-input id="description" placeholder="description" v-model.trim="item.file_characteristics.description"></b-form-input>
      </b-form-group>
      <b-form-group class="my-1" label="Encoding" key="encoding" horizontal lable-for="encoding" v-if="isFile(item)">
        <b-form-input id="encoding" placeholder="encoding" v-model.trim="item.file_characteristics.encoding"></b-form-input>
      </b-form-group>
      <RefList esDoctype="mime_type" placeholder="format" type="multiselect" help="help text" uiLabel="Format" :value="item.file_characteristics.file_type" :setValue="setFormat" v-if="isFile(item)" :customLabel="(item) => item.code">
      </RefList>
    </div>
  </b-modal>
</template>

<script>
import RefList from '../widgets/refdata/list-ui'

export default {
  name: 'fileedit-modal',
  props: {},
  data: function() {
    return {
      item: null,
      editable: [],
    }
  },
  methods: {
    show: function(item) {
      console.log('show', item)
      this.item = item
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

      this.$refs['actual-fileinfo-modal'].show()
    },
    reset: function() {
      this.apiData = null
      this.editable = []
    },
    save: function(items) {
      // TODO: how is this data saved? In what fields will it be saved?
      // Directories can also have a description and title for example
    },
    isFile: function(item) {
      return typeof item === 'object' && typeof item.file_name === 'string'
    },
    setUseCategory: function(value) {
      this.item.use_category = value
    },
    setFormat: function(value) {
      this.item.file_characteristics.file_format = value
    },
  },
  computed: {},
  components: {
    RefList,
  },
  created: function() {},
}
</script>
