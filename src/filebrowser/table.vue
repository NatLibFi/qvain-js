<template>
  <div>
    <FileInfoModal ref="refFileInfoModal" />
    <!-- BREADCRUMBS AND TOOLBAR -->
    <b-button-toolbar key-nav aria-label="File browser toolbar" class="d-flex align-items-center">
      <Breadcrumbs :breadcrumbs="breadcrumbs" :click="openDir" class="mr-auto" homePath="/">
      </Breadcrumbs>
    </b-button-toolbar>

    <!-- TABLE -->
    <b-table :fields="tableFields" :items="tableData" show-empty empty-text="no files in this directory"
      striped hover class="mb-0" @row-clicked="toggleSelection" :tbody-tr-class="rowClass">
      <template slot="selection" slot-scope="data">
        <b-form-checkbox class="m-0" v-model="data.item.picked" v-if="!data.item.selected">
        </b-form-checkbox>
      </template>
      <template slot="type" slot-scope="data">
        <b-btn v-if="data.item.type !=='file'" size="sm" @click.stop="openDir(data.item.path)"
          variant="link" class="m-0 p-0 float-right">
          <font-awesome-icon :icon="icon.faFolder" size="2x" />
        </b-btn>
      </template>
      <template slot="name" slot-scope="data">
        <b-btn v-if="data.item.type !== 'file'" variant="link" @click.stop="openDir(data.item.path)"
          class="m-0 p-0">{{data.item.name}}</b-btn>
        <span v-else>{{data.item.name}}</span>
      </template>
      <template slot="actions" slot-scope="data">
        <!-- actions for file -->
        <div v-if="data.item.type === 'file'">
          <b-btn size="sm" @click.stop="data.toggleDetails" class="mr-2">{{ data.detailsShowing ? 'Hide' : 'Show'}} Details</b-btn>
        </div>
      </template>
      <template slot="row-details" slot-scope="data">
        <b-card class="cursor-reset bg-light">
          <h4>Details</h4>
          <table class="table-sm table-borderless w-100 mb-3">
            <thead class="">
              <th>
                title
              </th>
              <th>
                encoding
              </th>
              <th>
                format
              </th>
              <th>
                application name
              </th>
            </thead>
            <tr class="bg-transparent">
              <td>
                {{ data.item.file.file_characteristics['title'] }}
              </td>
              <td>
                {{ data.item.file.file_characteristics['encoding'] }}
              </td>
              <td>
                {{ data.item.file.file_format }}
              </td>
              <td>
                {{ data.item.file.file_characteristics['application_name'] }}
              </td>
            </tr>
          </table>
          <div class="d-flex justify-content-between">
            <div>
              <p class="mt-2 mb-2">
                <b>description</b>
              </p>
              <p>{{ data.item.file.file_characteristics['description'] }}</p>
            </div>
            <b-btn-group class="align-self-end">
              <b-button @click.stop="data.toggleDetails " :pressed.sync="data.detailsShowing "
                variant="secondary" class="w-100 h-100">hide</b-button>
              <b-button @click.stop="()=> modalOpen(data.item.identifier, data.item.path, project)"
                variant="primary" class="w-100 h-100">json</b-button>
            </b-btn-group>
          </div>
        </b-card>
      </template>
    </b-table>
    <!-- BREADCRUMBS AND TOOLBAR -->
    <b-col cols="12 " md="auto " class="border-top border-bottom p-2 d-flex justify-content-end align-items-center ">
      <span class="px-4 ">{{picked}} items picked</span>
      <b-btn @click.stop="()=> savePicked()" variant="primary" :disabled="picked === 0">add picked</b-btn>
    </b-col>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faFolder } from '@fortawesome/free-solid-svg-icons'

import Breadcrumbs from './breadcrumbs.vue'
import dateFromIso from 'date-fns/parse'
import dateFormat from 'date-fns/format'
import FileTable from './table'
import FileInfoModal from './fileinfo-modal'

const formatBytes = (bytes, decimals) => {
  if (bytes == 0) return '0 Bytes'
  const k = 1024,
    dm = decimals || 2,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export default {
  name: 'FileTable',
  props: ['tableData', 'cwd', 'openDir', 'project', 'picked'],
  data: function() {
    return {
      tableFields: [
        {
          key: 'selection',
          label: '',
          class: 'pl-3 pr-0 mx-0',
          thStyle: { width: '0em' },
          tdClass: 'align-middle',
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
            return dateFormat(value, 'YYYY-MM-DD')
          },
          tdClass: 'align-middle',
        },
        {
          key: 'byte_size',
          label: 'Size',
          sortable: true,
          tdClass: 'align-middle',
          formatter: value => {
            return formatBytes(value)
          },
        },
        {
          key: 'actions',
          label: '',
        },
      ],
      icon: {
        faFolder,
      },
    }
  },
  methods: {
    toggleSelection: function(item, i, e) {
      if (e.target.tagName === 'LABEL') return
      console.log('toggleselection')
      if (item.selected) return
      if (!item.picked) {
        this.$store.commit('files/addPicked')
      } else {
        this.$store.commit('files/removePicked')
      }
      item.picked = !item.picked
    },
    rowClass: function(item) {
      const classes = []
      if (!item) return classes.join(' ')
      if (item.picked) {
        classes.push('table-primary')
      }
      if (item.selected) {
        classes.push('table-secondary text-muted')
      } else {
        classes.push('pointer')
      }
      return classes.join(' ')
    },
    savePicked: function() {
      console.log(this.$store.state.files.directory)
      this.$store.dispatch('files/savePicked')
    },
    modalOpen: function() {
      return this.$refs.refFileInfoModal.show.apply(this, arguments)
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
  },
  watch: {},
  components: {
    Breadcrumbs,
    FileInfoModal,
    FontAwesomeIcon,
  },
  created: function() {
    console.log('this', this)
  },
}
</script>
