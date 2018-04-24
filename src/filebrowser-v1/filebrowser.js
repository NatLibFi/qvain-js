import vFileList from './filelist.vue'
import axios from 'axios'

const API_PROJECT_ROOT_URL = "https://metax-test.csc.fi/rest/directories/root"

export default {
	name: "browser",
	data: function() {
		return {
			tabIndex: 0,
			error: null,
			rootId: null,
		}
	},
	methods: {
		getProjectForTab: function(index) {
			console.log("filebrowser getFilesForProject:", index, this.tabIndex, this.projects[index])
			this.tabIndex = index
			this.getRootForProject(this.projects[index])
		},
		getRootForProject: function(project) {
			var v = this
			
			console.log("DEBUG getting root for project", project)
			axios.get(API_PROJECT_ROOT_URL, {
				params: { project: project }
			})
				.then(function (response) {
					console.log("status:", response.status)
					v.processRoot(response.data, v.$data)
				})
				.catch(function (error) {
					console.log(error)
				})
		},
		processRoot: function(response, data) {
			if (!('id' in response)) data.error = "empty"
			console.log("root id:", response.id)
			data.rootId = response.id
			console.log("rootId set to:", data.rootId)
		},
	},
	computed: {
		user: function() {
			//return this.$store.state.auth.user
			return this.$store.getters['auth/getUserName']
		},
		projects: function() {
			return this.$store.getters['auth/getProjects']
		},
	},
	watch: {},
	components: {
		'filelist': vFileList,
	},
	created() {
		//console.log("store:", this.$store.getters)
	},
}
