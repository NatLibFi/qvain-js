import vFile from './file.vue'
import vTree from './tree.vue'
import vFileInfoModal from './fileinfo-modal.vue'
import axios from 'axios'
import dateFromIso from 'date-fns/parse'
import dateFormat from 'date-fns/format'

const API_BASE = "https://metax-test.csc.fi/rest/"

var fileapi = axios.create({
	baseURL: 'https://metax-test.csc.fi/rest/',
	timeout: 1000,
	// WARNING: some browsers don't allow setting the User-Agent header
	//headers: {'User-Agent': 'qvain.js (axios)'},
	//headers: {'X-Requested-With': 'qvain.js (axios)'},
	responseType: 'json'
})

//https://metax-test.csc.fi/rest/directories/files?project=project_x&path=/
/*
fileapi.get('/directories/files', {
	params: {
		project: 'project_x',
		path: '/'
	}
)
*/

function getReqParams(err) {
	return err && err.config && err.config.params || null
}

function getResStatus(err) {
	err && err.response && err.response.status || null
}

// https://metax-test.csc.fi/rest/directories/root?project=project_x
const API_PROJECT_ROOT_URL = "https://metax-test.csc.fi/rest/directories/root"
const API_DIR_URL = "https://metax-test.csc.fi/rest/directories/"

export default {
	name: "filelist",
	props: ['project', 'root', 'path'],
	data: function() {
		return {
			error: null,
			directories: [],
			files: [],
			error: null,
			rootId: null,
			cwd: '/',
			curId: null,
			curName: null,
			//curParentId: null,
			curDirInfo: null,
			fileFields: [
				'id',
				'file_name',
				'identifier',
				//'date_created',
				//'date_modified',
				{
					key: 'date_created',
					formatter: (value) => { return dateFormat(dateFromIso(value), 'YYYY-MM-DD') },
				},
				{
					key: 'date_modified',
					formatter: (value) => { return dateFormat(dateFromIso(value), 'YYYY-MM-DD') },
				},
				'actions',
			],
		}
	},
	methods: {
		parentDir: function(dir) {
			// strip last slash part; if we run out of slashes, parent dir must be root
			return dir.substring(0, dir.lastIndexOf('/')) || '/'
		},
		openDir: function(dir) {
			var vm = this
			
			console.log("openDir", dir)
			fileapi.get('/directories/files', {
				/*
				mode: 'no-cors',
				headers: {
					'Access-Control-Allow-Origin': '*',
				},
				*/
				params: {
					project: this.project,
					path: dir
				}
			})
			.then(function (response) {
				console.log("status:", response.status)
				vm.error = null
				vm.cwd = dir
				//vm.$router.push({ name: "files", params: { project: vm.project, relpath: vm.cwd.length > 1 ? vm.cwd.split('/') : undefined }})
				//vm.$router.push({ name: "files", params: { project: vm.project, relpath: dir.split('/').filter(x => x) }})
				vm.processResponse(response.data, vm.$data)
			})
			.catch(function (error) {
				// NOTE: if we have a CORS error, there is no response body and hence no status code :(
				//vm.$router.push({ name: "files", params: { project: vm.project, relpath: dir.split('/').filter(x => x) }})
				console.log("error:", error)
				for (let x in error) {
					console.log("key:", x)
				}
				console.log("response:", error.response.status)
				let reqPath = getReqParams(error) && error.config.params.path || null
				let resStatus = getResStatus(error) || null
				vm.error = "error: can't list files in " + (reqPath ? reqPath : "this path") + (resStatus ? "(status code " + resStatus + ")" : "")
			})
			.finally(function () {
				vm.$router.push({ name: "files", params: { project: vm.project, relpath: dir.split('/').filter(x => x) }})
			})
		},
		processResponse: function(response, data) {
			if (typeof response['directories'] === 'object' && response.directories.length > 0) {
				data.directories = response.directories.filter(d => 'directory_name' in d)
				//data.cwdId = response.directories.parent_directory
			} else {
				data.directories = []
			}
			
			if (typeof response['files'] === 'object' && response.files.length > 0) {
				data.files = response['files']
			} else {
				data.files = []
			}
		},
		modalOpen: function() {
			return this.$refs.refFileInfoModal.show.apply(this, arguments)
		},
		isSelected: function(id) {
			console.log("typeof:", typeof this.$store.getters['files/isSelected'], this.$store.getters['files/isSelected'])
			return this.$store.getters['files/isSelected'](this.project, id)
		},
		select: function(id) {
			console.log("selecting file with id:", id)
			this.$store.commit('files/addPath', {project: this.project, path: id})
		},
		deselect: function(id) {
			console.log("deselecting file with id:", id)
			this.$store.commit('files/removePath', {project: this.project, path: id})
		},
		selectDir: function(id) {
			console.log("selecting dir with id:", id)
			this.$store.commit('files/addDir', {project: this.project, path: id})
		},
		deselectDir: function(id) {
			console.log("selecting dir with id:", id)
			this.$store.commit('files/removeDir', {project: this.project, path: id})
		},
	},
	computed: {
		breadcrumbs: function() {
				//if (!this.cwd) { return '/' }
				return this.cwd.split('/').map(p => ({ text: p, disabled: true, active: false, event: null }))
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
			return this.$store.getters['files/getSelected'](this.project)
		},
		selectedDirs: function() {
			return this.$store.getters['files/getSelectedDirs'](this.project)
		},
		isToplevel: function() {
			return this.cwd.length <= 1
		}
	},
	watch: {},
	components: {
		'file': vFile,
		'filetree': vTree,
		'fileinfo-modal': vFileInfoModal,
	},
	created: function() {
		if (this.project != "project_x") { return }
		this.openDir(this.path)
		//this.getRootFor(this.project)
		//console.log("root dir:", this.root)
		//this.getFilesFor(this.curId)
		console.log("filelist params:", this.project, this.root, this.path)
		//this.curId = this.root
		//this.getFilesFor(this.curId)
		console.log("store:", this.$store.getters)
	},
}
