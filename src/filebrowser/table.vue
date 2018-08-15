<template>
  <div>
    <!-- BREADCRUMBS AND TOOLBAR -->
    <b-button-toolbar key-nav aria-label="File browser toolbar" class="d-flex align-items-center">
      <Breadcrumbs :breadcrumbs="breadcrumbs" :click="openDir" class="mr-auto" homePath="/">
      </Breadcrumbs>
    </b-button-toolbar>

    <!-- TABLE -->
    <b-table :fields="tableFields" :items="tableData" show-empty empty-text="no files in this directory" striped hover class="mb-0" :tbody-tr-class="rowClass">
      <template slot="selection" slot-scope="data">
        <b-form-checkbox class="m-0" :value="{identifier: data.item.identifier, type: data.item.type}" v-model="selected">
        </b-form-checkbox>
      </template>
      <template slot="type" slot-scope="data">
        <b-btn v-if="data.item.type !=='file'" size="sm" @click.stop="openDir(data.item.path)" variant="link" class="m-0 p-0 float-right">
          <i class="fas fa-folder fa-2x"></i>
        </b-btn>
      </template>
      <template slot="name" slot-scope="data">
        <b-btn v-if="data.item.type !== 'file'" variant="link" @click.stop="openDir(data.item.path)" class="m-0 p-0">{{data.item.name}}</b-btn>
        <span v-else>{{data.item.name}}</span>
      </template>
      <template slot="actions" slot-scope="data">
        <!-- actions for file -->
        <div v-if="data.item.type === 'file'">
          <b-btn size="sm" @click.stop="data.toggleDetails" :pressed.sync="data.detailsShowing" class="mr-2">details</b-btn>
        </div>
      </template>
      <template slot="row-details" slot-scope="data">
        <b-card>
          <b-row class="mb-2">
            <b-col sm="3" class="text-sm-right">
              <b>title:</b>
            </b-col>
            <b-col>{{ data.item.file.file_characteristics['title'] }}</b-col>
          </b-row>
          <b-row class="mb-2">
            <b-col sm="3" class="text-sm-right">
              <b>description:</b>
            </b-col>
            <b-col>{{ data.item.file.file_characteristics['description'] }}</b-col>
          </b-row>
          <b-row class="mb-2">
            <b-col sm="3" class="text-sm-right">
              <b>encoding:</b>
            </b-col>
            <b-col>{{ data.item.file.file_characteristics['encoding'] }}</b-col>
          </b-row>
          <b-row class="mb-2">
            <b-col sm="3" class="text-sm-right">
              <b>format:</b>
            </b-col>
            <b-col>{{ data.item.file.file_format }}</b-col>
          </b-row>
          <b-row class="mb-2">
            <b-col sm="3" class="text-sm-right">
              <b>application name:</b>
            </b-col>
            <b-col>{{ data.item.file.file_characteristics['application_name'] }}</b-col>
          </b-row>
          <b-button size="sm" @click.stop="() => modalOpen(data.item.identifier, data.item.path, project)">json</b-button>
          <b-button size="sm" @click.stop="data.toggleDetails" :pressed.sync="data.detailsShowing">hide</b-button>
        </b-card>
      </template>
    </b-table>
    <!-- BREADCRUMBS AND TOOLBAR -->
    <b-col cols="12" md="auto" class="border-top border-bottom p-2 d-flex justify-content-end align-items-center">
      <span class="px-4">{{selected.length}} items selected</span>
      <b-btn @click.stop="() => addSelected()" variant="primary" :disabled="selected.length === 0">add selected</b-btn>
    </b-col>
  </div>
</template>

<script>
import Breadcrumbs from './breadcrumbs.vue'
import dateFromIso from 'date-fns/parse'
import dateFormat from 'date-fns/format'
import FileTable from './table'

export default {
  name: 'FileTable',
  props: ['tableData', 'cwd', 'openDir', 'project'],
  data: function() {
    return {
      tableFields: [
        {
          key: 'selection',
          label: '',
          class: 'pl-3 pr-0 mx-0',
          thStyle: { width: '0em' },
        },
        {
          key: 'type',
          label: '',
          tdClass: 'align-middle',
          class: 'px-2 mx-0',
          thStyle: { width: '3.5em' },
        },
        {
          key: 'name',
          sortable: true,
          tdClass: 'align-middle',
        },
        {
          key: 'identifier',
          sortable: true,
          tdClass: 'align-middle',
        },
        {
          key: 'date_modified',
          sortable: true,
          formatter: value => {
            return dateFormat(dateFromIso(value), 'YYYY-MM-DD')
          },
          tdClass: 'align-middle',
        },
        {
          key: 'byte_size',
          label: 'Size',
          sortable: true,
          tdClass: 'align-middle',
        },
        {
          key: 'actions',
          label: '',
        },
      ],
      selected: [],
    }
  },
  methods: {
    toggleSelection: function(item) {
      console.log('toggleSelection')
      const index = this.selected.findIndex(
        single => single.identifier === item.identifier,
      )
      if (index === -1) {
        item.selected = true
        this.selected.push({ identifier: item.identifier, type: item.type })
      } else {
        item.selected = false
        this.selected.splice(index, 1)
      }
    },
    rowClass: function(item) {
      console.log('update row class')
      const classes = ['pointer']
      console.log('item', item.identifier)
      console.log('selected', this.isSelected(item.identifier))
      if (!item) return classes.join(' ')
      if (this.isSelected(item.identifier)) {
        classes.push('table-primary')
      }
      return classes.join(' ')
    },
    addSelected: function() {
      this.$store.dispatch('files/addSelected', this.selected)
      this.selected = []
    },
    isSelected: function(id) {
      return this.selected.find(single => single.identifier === id)
        ? true
        : false
    },
  },
  computed: {
    breadcrumbs: function() {
      let split = this.cwd.split('/')
      let currpath = []
      return this.cwd.split('/').map(p => {
        currpath.push(p)
        return {
          label: p,
          to: currpath.join('/'),
        }
      })
    },
    selectedDirs: function() {
      return this.$store.getters['files/getSelectedDirs']
    },
    selectedFiles: function() {
      return this.$store.getters['files/getSelectedFiles']
    },
  },
  watch: {},
  components: {
    Breadcrumbs,
  },
  created: function() {
    console.log('this', this)
  },
}
</script>
