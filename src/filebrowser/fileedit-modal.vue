<template>
  <b-modal id="actual-fileedit-modal" ref="actual-fileinfo-modal" @hide="reset" title="Set metadata">
    <b-row class="my-1" v-for="(item, i) in editable" :key="item.label">
      <b-col sm="3">
        <b>
          <label :for="'input' + i">{{item.label}}</label>
        </b>
      </b-col>
      <b-col sm="9">
        <b-form-input :id="'input' + i" :placeholder="item.label" v-model.trim="item.value"></b-form-input>
      </b-col>
    </b-row>
    <!-- <b-form-group description="description comes here." label="Enter your label" label-for="input1" :state="state">
      <b-form-input id="input1" :state="state" v-model.trim="title" placeholder="title"></b-form-input>
      <b-form-input id="input2" :state="state" v-model.trim="description" placeholder="description"></b-form-input>
      <b-form-input id="input3" :state="state" v-model.trim="encoding" placeholder="encoding"></b-form-input>
      <b-form-input id="input3" :state="state" v-model.trim="format" placeholder="format"></b-form-input>
    </b-form-group> -->
  </b-modal>
</template>

<script>
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
      console.log('modal item', item)
      // TODO: define fields to display here for files and for folders
      if (
        typeof item === 'object' &&
        typeof item['file_characteristics'] === 'object'
      ) {
        let chars = item['file_characteristics']
        chars['title'] &&
          this.editable.push({ label: 'Title', value: chars['title'] })
        chars['description'] &&
          this.editable.push({
            label: 'Description',
            value: chars['description'],
          })
        chars['encoding'] &&
          this.editable.push({ label: 'Encoding', value: chars['encoding'] })
        item['file_format'] &&
          this.editable.push({ label: 'Format', value: item['file_format'] })
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
  created: function() {},
}
</script>
