<template>
  <div>
    <b-tabs pills card vertical>
      <b-tab :title="`Project ${proj}`" v-for="proj in projects" :key="proj" no-body @click="() => updateProject(proj)" :active="proj === project">
        <filelist :project="proj" :root="rootId" :path="path" v-if="proj === project"></filelist>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import vFileList from './filelist.vue'
import axios from 'axios'

var API_PROJECT_ROOT_URL = 'https://metax-test.csc.fi/rest/directories/root'

export default {
  name: 'browser',
  props: ['project', 'relpath'],
  data: function() {
    return {
      tabIndex: 0,
      error: null,
      rootId: null,
    }
  },
  methods: {
    updateProject: function(project, initial) {
      this.$store.commit('files/updateProject', project)
      if (!initial) {
        this.$router.push({
          name: 'files',
          params: { project: project },
        })
      }
    },
  },
  computed: {
    path: function() {
      // After hotreloading relpath will be an array of values.
      if (typeof this.relpath === 'object') {
        return this.relpath ? '/' + this.relpath.join('/') : '/'
      }
      console.log('relpath inside path', this.relpath)
      return this.relpath ? '/' + this.relpath : '/'
    },
    projects: function() {
      return this.$store.getters['auth/getProjects']
    },
  },
  watch: {},
  components: {
    filelist: vFileList,
  },
  created() {
    this.updateProject(this.project, true)
    //this.$router.push({ name: "files", params: { project: this.project, relpath: this.relpath || [] }})
    // this.$router.push({
    //   name: 'files',
    //   params: { project: this.project, relpath: this.relpath || [] },
    // })
  },
}
</script>
