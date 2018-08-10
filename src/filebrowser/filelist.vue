<template>
  <div>
    <fileinfo-modal ref="refFileInfoModal"></fileinfo-modal>
    <fileedit-modal ref="refFileEditModal"></fileedit-modal>

    <b-row no-gutters>
      <b-col class="bg-primary py-3 px-4">
        <h1 class="text-white">{{ project }}</h1>
      </b-col>
    </b-row>

    <b-alert variant="danger" :show="!!error">{{ error }}</b-alert>

    <b-button-toolbar key-nav aria-label="File browser toolbar" class="d-flex align-items-center">
      <Breadcrumbs :breadcrumbs="breadcrumbs" :click="openDir" class="mr-auto" homePath="/">
      </Breadcrumbs>
      <b-col cols="12" md="auto">
        <b-button-group class="">
          <b-btn @click.stop="deselectDir(cwd)" v-if="cwd in selectedDirs">remove directory</b-btn>
          <b-btn @click.stop="selectDir(cwd)" :disabled="isSelectedDeep" v-else variant="primary">add directory</b-btn>
        </b-button-group>
      </b-col>
    </b-button-toolbar>

    <b-table :fields="fileFields" :items="filesAndFolders" show-empty empty-text="no files in this directory" striped hover>
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
        <b-btn size="sm" @click.stop="deselect(data.item.id)" :class="{ 'btn-outline-primary': isSelectedDeep }" class="mr-2" :disabled="isSelectedDeep" v-if="data.item.id in selected">remove</b-btn>
        <b-btn size="sm" @click.stop="select(data.item.id)" :class="{ 'btn-outline-primary': isSelectedDeep }" class="mr-2" :disabled="isSelectedDeep" v-else variant="primary">{{ isSelectedDeep ?"selected" :"add" }}</b-btn>
        <b-btn size="sm" @click.stop="data.toggleDetails" :pressed.sync="data.detailsShowing" class="mr-2" v-if="data.item.type === 'file'">details</b-btn>
        <b-btn size="sm" @click.stop="edit(data.item, data.index, $event.target)" class="mr-2" v-if="data.item.type === 'file'">edit</b-btn>
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
          <b-button size="sm" @click.stop="modalOpen(data.item.id, data.item.file_path, project)">json</b-button>
          <b-button size="sm" @click.stop="data.toggleDetails" :pressed.sync="data.detailsShowing">hide</b-button>
        </b-card>
      </template>

    </b-table>

    <b-modal id="modalEditFile" @hide="resetEditFileModal" :title="modalEditFile.title" ok-only>
      <pre>{{ modalEditFile.content }}</pre>
      <b-form-group description="description comes here." label="Enter your label" label-for="input1" :state="modalEditFile.state">
        <b-form-input id="input1" :state="modalEditFile.state" v-model.trim="modalEditFile.title"></b-form-input>
        <b-form-input id="input2" :state="modalEditFile.state" v-model.trim="modalEditFile.description"></b-form-input>
      </b-form-group>
    </b-modal>

  </div>
</template>

<script>
import vFile from './file.vue'
import vTree from './tree.vue'
import vFileInfoModal from './fileinfo-modal.vue'
import vFileEditModal from './fileedit-modal.vue'
import Breadcrumbs from './breadcrumbs.vue'
import axios from 'axios'
import dateFromIso from 'date-fns/parse'
import dateFormat from 'date-fns/format'

var fileapi = axios.create({
  baseURL: 'https://metax-test.csc.fi/rest/',
  timeout: 3000,
  responseType: 'json',
})

const getReqParams = err => (err && err.config && err.config.params) || null

const getResStatus = err => (err && err.response && err.response.status) || null

export default {
  name: 'filelist',
  props: ['project', 'root', 'path'],
  data: function() {
    return {
      error: null,
      selectedOnly: true,
      directories: [],
      files: [],
      filesAndFolders: [],
      rootId: null,
      cwd: '/',
      curId: null,
      curName: null,
      //curParentId: null,
      curDirInfo: null,
      fileFields: [
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
        'actions',
      ],
      filter: null,
      modalEditFile: { title: '', description: '', content: '', state: null },
    }
  },
  methods: {
    parentDir: function(dir) {
      // strip last slash part; if we run out of slashes, parent dir must be root
      return dir.substring(0, dir.lastIndexOf('/')) || '/'
    },
    openDir: function(dir) {
      var vm = this
      console.log('openDir', dir)
      if (typeof dir !== 'string') {
        console.warn('dir is not a string:', typeof dir, dir)
      }
      fileapi
        .get('/directories/files', {
          params: {
            project: this.project,
            path: dir,
          },
        })
        .then(function(response) {
          console.log('status:', response.status)
          vm.error = null
          vm.cwd = dir
          vm.processResponse(response.data, vm.$data)
        })
        .catch(function(error) {
          // NOTE: if we have a CORS error, there is no response body and hence no status code :(
          //vm.$router.push({ name:"files", params: { project: vm.project, relpath: dir.split('/').filter(x => x) }})
          console.log('error:', error)
          for (let x in error) {
            console.log('key:', x)
          }
          console.log('response:', error.response.status)
          let reqPath =
            (getReqParams(error) && error.config.params.path) || null
          let resStatus = getResStatus(error) || null
          vm.error =
            "error: can't list files in" +
            (reqPath ? reqPath : 'this path') +
            (resStatus ? '(status code ' + resStatus + ')' : '')
        })
        .finally(function() {
          vm.$router.push({
            name: 'files',
            params: {
              project: vm.project,
              relpath: dir.split('/').filter(x => x),
            },
          })
        })
    },
    processResponse: function(response, data) {
      if (
        typeof response['directories'] === 'object' &&
        response.directories.length > 0
      ) {
        data.directories = response.directories.filter(
          d => 'directory_name' in d,
        )
        //data.cwdId = response.directories.parent_directory
      } else {
        data.directories = []
      }

      if (typeof response['files'] === 'object' && response.files.length > 0) {
        data.files = response['files']
      } else {
        data.files = []
      }
      this.combineFilesAndFolders(data.files, data.directories)
    },
    combineFilesAndFolders: function(files, folders) {
      // combines folders and files into single array of objects
      /*
        {
          type: ,
          identifier: ,
          name: ,
          path: ,
          byte_size: ,
          date_modified: ,
          directory: {
            file_count: ,
          }
          file: {
            file_format?: ,
            open_access?: ,
            file_characteristics: ,
            checksum: ,
          }
        }
      */
      let parsedFiles = []
      let parsedFolders = []
      if (files) {
        parsedFiles = files.map(file => ({
          type: 'file',
          identifier: file.identifier,
          name: file.file_name,
          path: file.file_path,
          byte_size: file.byte_size,
          date_modified: file.date_modified,
          file: {
            file_format: file.file_format,
            open_access: file.open_access,
            file_characteristics: file.file_characteristics,
            checksum: { value: file.checksum_value },
          },
          directory: undefined,
        }))
      }
      if (folders) {
        parsedFolders = folders.map(folder => ({
          type: 'dir',
          identifier: folder.identifier,
          name: folder.directory_name,
          path: folder.directory_path,
          byte_size: folder.byte_size,
          date_modified: folder.date_modified,
          directory: {
            file_count: folder.file_count,
          },
          file: undefined,
        }))
      }
      this.filesAndFolders = [...parsedFolders, ...parsedFiles]
    },
    modalOpen: function() {
      return this.$refs.refFileInfoModal.show.apply(this, arguments)
    },
    isSelected: function(id) {
      console.log(
        'typeof:',
        typeof this.$store.getters['files/isSelected'],
        this.$store.getters['files/isSelected'],
      )
      return this.$store.getters['files/isSelected'](this.project, id)
    },
    select: function(id) {
      console.log('selecting file with id:', id)
      this.$store.commit('files/addFile', { project: this.project, path: id })
    },
    deselect: function(id) {
      console.log('deselecting file with id:', id)
      this.$store.commit('files/removeFile', {
        project: this.project,
        path: id,
      })
    },
    selectDir: function(id) {
      console.log('selecting dir with id:', id)
      this.$store.commit('files/addDir', { project: this.project, path: id })
    },
    deselectDir: function(id) {
      console.log('selecting dir with id:', id)
      this.$store.commit('files/removeDir', { project: this.project, path: id })
    },
    edit: function(item, index, button) {
      //this.modalEditFile.title = `Row index: ${index}`
      //this.modalEditFile.content = JSON.stringify(item, null, 2)
      //this.$root.$emit('bv::show::modal', 'modalEditFile', button)
      return this.$refs.refFileEditModal.show.apply(this, arguments)
    },
    resetEditFileModal: function() {
      this.modalEditFile.title = ''
      //this.modalEditFile.content = ''
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
    curParentId: function() {
      if (!this.curDirInfo || !this.curDirInfo['parent_directory']) return null
      return this.curDirInfo['parent_directory']['id'] || null
    },
    currentPath: function() {
      if (!this.curDirInfo) return null
      return this.curDirInfo['directory_path'] || null
    },
    isSelectedDeep: function() {
      return this.$store.getters['files/prefixMatcher'](this.project, this.cwd)
    },
    selected: function() {
      return this.$store.getters['files/getSelectedFiles'](this.project)
    },
    selectedDirs: function() {
      return this.$store.getters['files/getSelectedDirs'](this.project)
    },
    isToplevel: function() {
      return this.cwd.length <= 1
    },
  },
  watch: {},
  components: {
    file: vFile,
    filetree: vTree,
    'fileinfo-modal': vFileInfoModal,
    'fileedit-modal': vFileEditModal,
    Breadcrumbs: Breadcrumbs,
  },
  created: function() {
    if (this.project != 'project_x') {
      return
    }
    this.openDir(this.path)
    console.log('filelist params:', this.project, this.root, this.path)
    console.log('store:', this.$store.getters)
  },
}
</script>
