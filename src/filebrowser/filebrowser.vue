<template>
  <div>
    <b-dropdown text="Change project" class="my-3">
      <b-dropdown-item v-for="proj in projects" :key="proj" @click="() => updateProject(proj)">Project {{proj}}</b-dropdown-item>
    </b-dropdown>
    <filelist :project="selectedProject" :path="path" v-if="selectedProject"></filelist>
  </div>
</template>

<script>
import vFileList from './filelist.vue'
import axios from 'axios'

var API_PROJECT_ROOT_URL = 'https://metax-test.csc.fi/rest/directories/root'

export default {
  name: 'browser',
  props: ['relpath'],
  data: function() {
    return {
      selectedProject: this.$route.params.project ? this.$route.params.project : this.$store.getters['auth/getProjects'][0],
      tabIndex: 0,
      error: null,
    }
  },
  methods: {
    updateProject: function(proj) {
      this.selectedProject = proj
      this.$store.commit('files/updateProject', proj)
      this.$router.push({
        name: 'files',
        params: { project: proj },
      })
    },
  },
  computed: {
    path: function() {
      // After hot reloading relpath will be an array of values.
      if (typeof this.relpath === 'object') {
        return this.relpath ? '/' + this.relpath.join('/') : '/'
      }
      return this.relpath ? '/' + this.relpath : '/'
    },
    projects: function() {
      return this.$store.getters['auth/getProjects']
    },
    project: function() {
      return this.$route.params.project
    }
  },
  watch: {},
  components: {
    filelist: vFileList,
  },
  beforeCreate() {
    console.log('before create')
    this.$store.commit('files/updateProject', this.$route.params.project ? this.$route.params.project : this.$store.getters['auth/getProjects'][0])
  },
}
</script>
