<template>
  <b-modal id="actual-fileedit-modal" ref="actual-fileinfo-modal" @hide="reset" title="Set metadata"
    ok-only>
    <div v-if="item">
      <RefList esDoctype="use_category" placeholder="use category" help="help text" uiLabel="Use category"
        :value="item.use_category" :setValue="setUseCategory" type="multiselect" :customLabel="(item) => item.label['en'] ? item.label['en'] : item.label.und"
        isRequired>
      </RefList>
      <b-form-group class="my-1" label="Title" key="title" horizontal lable-for="title">
        <b-form-input id="title" placeholder="title" v-model="item.file_characteristics.title"
          v-if="isFile(item)" @change="validateTitle" :state="valid.title"></b-form-input>
        <b-form-input v-else id="title" placeholder="title" v-model="item.title" @change="validateTitle"
          :state="valid.title"></b-form-input>
      </b-form-group>
      <b-form-group class="my-1" label="Description" key="description" horizontal lable-for="description">
        <b-form-input id="description" placeholder="description" v-model="item.file_characteristics.description"
          v-if="isFile(item)"></b-form-input>
        <b-form-input id="description" placeholder="description" v-model="item.description"
          v-else></b-form-input>
      </b-form-group>
      <b-form-group class="my-1" label="Encoding" key="encoding" horizontal lable-for="encoding"
        v-if="isFile(item)">
        <b-form-input id="encoding" placeholder="encoding" v-model="item.file_characteristics.encoding"></b-form-input>
      </b-form-group>
      <RefList esDoctype="mime_type" placeholder="format" type="multiselect" help="help text"
        uiLabel="Format" :value="item.file_characteristics.file_format" :setValue="setFormat"
        v-if="isFile(item)" :customLabel="(item) => item.code">
      </RefList>
    </div>
  </b-modal>
</template>

<script>
import RefList from '../../widgets/refdata/list-ui'
import Vue from 'vue'

export default {
  name: 'fileedit-modal',
  props: {},
  data: function() {
    return {
      item: null,
      valid: {
        title: null,
      },
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

      this.$refs['actual-fileinfo-modal'].show()
    },
    reset: function() {
      this.apiData = null
      this.item = null
    },
    save: function(items) {
      // TODO: how is this data saved? In what fields will it be saved?
      // Directories can also have a description and title for example
    },
    isFile: function(item) {
      return typeof item === 'object' && typeof item.file_name === 'string'
    },
    setUseCategory: function(value) {
      Vue.set(this.item, 'use_category', value)
    },
    setFormat: function(value) {
      Vue.set(this.item.file_characteristics, 'file_format', value)
    },
    validateTitle: function(value) {
      if (value) {
        this.valid.title = null
      } else {
        this.valid.title = false
      }
    },
  },
  computed: {},
  components: {
    RefList,
  },
  created: function() {},
}
</script>
