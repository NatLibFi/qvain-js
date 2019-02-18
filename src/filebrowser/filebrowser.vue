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

//let API_PROJECT_ROOT_URL = 'https://metax-test.csc.fi/rest/directories/root'

export default {
	name: 'browser',
	props: {
		relpath: {},
	},
	data: function() {
		return {
			selectedProject: this.$route.params.project ? this.$route.params.project : (this.$auth.user.projects[0] || null),
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
			console.log('relpath', this.$route.params.relpath)
			// After hot reloading relpath will be an array of values.
			if (typeof this.$route.params.relpath === 'object') {
				console.warn('RELPATH IS A OBJECT!')
				return this.$route.params.relpath ? '/' + this.$route.params.relpath.join('/') : '/'
			}
			return this.$route.params.relpath ? '/' + this.$route.params.relpath : '/'
		},
		projects: function() {
			//return this.$store.getters['auth/getProjects']
			return this.$auth.user.projects || []
		},
		project: function() {
			return this.$route.params.project
		},
	},
	watch: {},
	components: {
		filelist: vFileList,
	},
	beforeCreate() {
		console.log('before create, projects:', this.$auth.user.projects)
		//this.$store.commit('files/updateProject', this.$route.params.project ? this.$route.params.project : this.$store.getters['auth/getProjects'][0])
		this.$store.commit('files/updateProject', this.$route.params.project ? this.$route.params.project : (this.$auth.user.projects[0] || null))
	},
}
</script>
