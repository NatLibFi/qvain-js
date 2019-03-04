<template>
  <b-modal id="actual-fileedit-modal" ref="actual-fileinfo-modal" @hide="reset" title="Set metadata" @ok="save">
    <div v-if="item">

      <RefList esDoctype="use_category" placeholder="use category" help="help text" uiLabel="Use category"
	  :value="item.use_category" :setValue="setUseCategory" type="multiselect" :customLabel="(item) => item['pref_label'] ? item['pref_label']['en'] || item['pref_label']['fi'] || item['pref_label']['und'] || '(no label)' : item['identifier']" isRequired>
      </RefList>

      <b-form-group class="my-1" label="Title" key="title" horizontal lable-for="title">
        <b-form-input id="title" placeholder="title" v-model="item.title" @change="validateTitle" :state="valid.title"></b-form-input>
      </b-form-group>

      <b-form-group class="my-1" label="Description" key="description" horizontal lable-for="description">
        <b-form-input id="description" placeholder="description" v-model="item.description"></b-form-input>
      </b-form-group>

      <RefList esDoctype="file_type" placeholder="file type" type="multiselect" help="help text"
        uiLabel="File Type" :value="item.file_type" :setValue="setType"
        v-if="isFile(item)" :customLabel="(item) => item['pref_label'] ? item['pref_label']['en'] || item['pref_label']['fi'] || item['pref_label']['und'] || '(no label)' : item['identifier']">
      </RefList>

    </div>
  </b-modal>
</template>

<script>
import RefList from '@/widgets/refdata/list-ui'
import RealRefList from '@/components/ReferenceData.vue' // this is not used atm
import Vue from 'vue'

export default {
	name: 'fileedit-modal',
	components: {
		RefList,
		RealRefList,
	},
	data() {
		return {
			item: null,
			valid: {
				title: null,
			},
		}
	},
	methods: {
		show(single) {
			console.log('show', single)
			this.item = single
			// TODO: define fields to display here for files and for folders
			// currently it gets fields from file characteristics, but folders don't have that
			// in tietomalli/mrd you can see that folders also have a title and a description
			// which both are provided by the user.

			this.$refs['actual-fileinfo-modal'].show()
		},
		reset() {
			this.item = null
		},
		save() {
			this.$store.commit('updateArrayValue', {
				p: this.$store.state.record,
				prop: this.isFile(this.item) ? 'files' : 'directories',
				val: this.item,
				search: {
					field: 'identifier',
					value: this.item.identifier,
				},
			})
		},
		isFile(item) {
			return 'file_type' in item
		},
		setUseCategory(value) {
			// TODO: -wvh- hack
			if (!value) return

			delete value['label']
			delete value['code']
			delete value['id']
			delete value['type']

			/*
			const mapToStore = option => {
				const { identifier, label: { sv, en, fi, und } } = option;
				return { identifier, [this.labelNameInSchema]: { sv, en, fi, und } };
			}
			*/

			this.item.use_category = value
		},
		setType(value) {
			// TODO: -wvh- hack
			if (!value) return
			/*
			if (value['uri']) {
				value['identifier'] = value['uri']
				delete value['uri']
			}
			if (value['label']) {
				value['pref_label'] = value['label']
				delete value['label']
			}
			*/
			delete value['label']
			delete value['code']
			delete value['id']
			delete value['type']

			this.item.file_type = value
		},
		validateTitle: function(value) {
			if (value) {
				this.valid.title = null
			} else {
				this.valid.title = false
			}
		},
	},
}
</script>
