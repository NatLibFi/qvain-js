<template>
	<b-modal id="actual-fileedit-modal" ref="actual-fileinfo-modal" @hide="reset" title="set file metadata" ok-only>
		<b-form-group description="description comes here." label="Enter your label" label-for="input1" :state="state">
			<b-form-input id="input1" :state="state" v-model.trim="title" placeholder="title"></b-form-input>
			<b-form-input id="input2" :state="state" v-model.trim="description" placeholder="description"></b-form-input>
			<b-form-input id="input3" :state="state" v-model.trim="encoding" placeholder="encoding"></b-form-input>
			<b-form-input id="input3" :state="state" v-model.trim="format" placeholder="format"></b-form-input>
		</b-form-group>
		{{ title }}
		<pre>{{ apiData }}</pre>
	</b-modal>
</template>

<script>
export default {
  name: 'fileedit-modal',
  props: {},
  data: function() {
    return {
      title: null,
      description: null,
      encoding: null,
      format: null,
      state: null,
      apiData: null,
    }
  },
  methods: {
    show: function(item) {
      this.apiData = item
      // TODO: define fields to display here for files and for folders
      if (
        typeof item === 'object' &&
        typeof item['file_characteristics'] === 'object'
      ) {
        let chars = item['file_characteristics']
        this.title = chars['title'] || null
        this.description = chars['description'] || null
        this.encoding = chars['encoding'] || null
        this.format = item['file_format'] || null
      }
      this.$refs['actual-fileinfo-modal'].show()
    },
    reset: function() {
      this.apiData = null
      this.title = null
      this.encoding = null
      this.description = null
      this.format = null
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
