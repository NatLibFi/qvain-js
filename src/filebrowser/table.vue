<template>
  <div>
    <fileinfo-modal ref="refFileInfoModal"></fileinfo-modal>
    <fileedit-modal ref="refFileEditModal"></fileedit-modal>

    <!-- BREADCRUMBS AND TOOLBAR -->
    <b-button-toolbar key-nav aria-label="File browser toolbar" class="d-flex align-items-center">
      <Breadcrumbs :breadcrumbs="breadcrumbs" :click="openDir" class="mr-auto" homePath="/">
      </Breadcrumbs>
    </b-button-toolbar>

    <!-- TABLE -->
    <b-table :fields="tableFields" :items="tableData" show-empty empty-text="no files in this directory" striped hover @row-clicked="toggleSelection" class="mb-0">
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
          <b-button size="sm" @click.stop="modalOpen(data.item.identifier, data.item.path, project)">json</b-button>
          <b-button size="sm" @click.stop="data.toggleDetails" :pressed.sync="data.detailsShowing">hide</b-button>
        </b-card>
      </template>
    </b-table>
    <!-- BREADCRUMBS AND TOOLBAR -->
    <b-col cols="12" md="auto" class="border-top border-bottom p-2 d-flex justify-content-end align-items-center">
        <span class="px-4">{{selected.length}} items selected</span><b-btn @click.stop="addSelected()" variant="primary" :disabled="selected.length === 0">add selected</b-btn>
    </b-col>
  </div>
</template>

<script>
import Breadcrumbs from './breadcrumbs.vue'
import vFileInfoModal from './fileinfo-modal.vue'
import vFileEditModal from './fileedit-modal.vue'
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
          key: 'select',
          label: '',
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
      const index = this.selected.findIndex(single => single.identifier === item.identifier)
      if (index === -1) {
        item.selected = true
        this.selected.push({ identifier: item.identifier, type: item.type })
      } else {
        item.selected = false
        this.selected.splice(index, 1)
      }
    },
    rowClass(item, type) {
      if (!item) return
      if (this.isSelected(item.identifier)) return 'table-info'
    },
    addSelected: function() {
      this.$store.dispatch('files/addSelected', { project: this.project, items: this.selected })
      this.selected = []
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
    isSelected: function(id) {
      return this.selected.includes(id)
    },
    selectedDirs: function() {
      return this.$store.getters['files/getSelectedDirs'](this.project)
    },
    selectedFiles: function() {
      return this.$store.getters['files/getSelectedFiles'](this.project)
    },
  },
  watch: {},
  components: {
    'fileinfo-modal': vFileInfoModal,
    'fileedit-modal': vFileEditModal,
    Breadcrumbs,
  },
  created: function() {},
}
</script>
