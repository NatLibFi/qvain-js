<template>
  <div>
    <b-row no-gutters>
      <b-col class="bg-primary py-3 px-4 d-flex justify-content-between">
        <h1 class="text-white">Project {{ project }}</h1>
      </b-col>
    </b-row>
    <b-alert variant="danger" :show="!!error">{{ error }}</b-alert>
    <FileTable v-if="directory" :tableData="directory" :openDir="openDir"
      :project="project" :cwd="cwd" />
    <SelectButtons />
    <SelectedFiles icon="fas fa-folder fa-2x" :data="getAllSelected()" />
  </div>
</template>

<script>
import FileTable from './table'
import SelectedFiles from './selectedFiles'
import SelectButtons from './selectButtons'

const getReqParams = err => (err && err.config && err.config.params) || null

const getResStatus = err => (err && err.response && err.response.status) || null

export default {
  name: 'filelist',
  props: ['project', 'path'],
  data: function() {
    return {
      error: null,
      directory: null,
      cwd: '/',
    }
  },
  methods: {
    openDir: function(dir) {
      if (!dir) {
        dir = '/'
      }
      const vm = this
      this.$store
        .dispatch('files/queryContent', { dir, project: this.project })
        .then(data => {
          vm.cwd = dir
          vm.getDirectory()
          console.log('directory opened')
        })
        .catch(error => {
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
          vm.error = `error: can't list files in ${
            reqPath ? reqPath : 'this path'
          } ${resStatus ? `(status code ${resStatus})` : ''}`
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
    getAllSelected: function() {
      const files = this.$store.getters['files/getSelectedFiles']
      const dirs = this.$store.getters['files/getSelectedDirs']
      if (!files && !dirs) return false
      return [
        dirs && { type: 'dir', data: dirs },
        files && { type: 'file', data: files },
      ]
    },
    getDirectory: function() {
      this.directory = this.$store.state.files.projects[this.project][this.cwd]
    },
  },
  watch: {
    project: {
      immediate: true,
      handler(newP, old) {
        this.error = null
        this.openDir(this.path)
      }
    }
  },
  components: {
    FileTable,
    SelectedFiles,
    SelectButtons
  },
}
</script>
