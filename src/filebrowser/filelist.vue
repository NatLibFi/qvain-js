<template>
	<div>
		<fileinfo-modal ref="refFileInfoModal"></fileinfo-modal>
		<fileedit-modal ref="refFileEditModal"></fileedit-modal>

		file list for <b>{{ project }}</b> path <b>{{ cwd }}</b> deep: {{ isSelectedDeep }}

		<ul v-if="directories.length">
			<li v-for="dir in directories" :key="dir.id">
				<a @click="openDir(dir.directory_path)">{{ dir.directory_name }}</a> ({{ dir.id }} {{ dir.identifier }})
			</li>
		</ul>
		<p v-else>no directories</p>

		<b-alert variant="danger" :show="!!error">{{ error }}</b-alert>
		<hr/>
		<b-breadcrumb :items="breadcrumbs"/>
		<hr/>

		<b-button-toolbar key-nav aria-label="File browser toolbar">
			<b-button-group class="mx-1">
				<b-btn v-b-tooltip.hover title="go to project top directory" @click="openDir('/')" :disabled="isToplevel"><i class="fa fa-angle-double-up" aria-hidden="true"></i></b-btn>
				<b-btn v-b-tooltip.hover title="go up one level" @click="openDir(parentDir(cwd))" :disabled="isToplevel"><i class="fa fa-angle-up" aria-hidden="true"></i></b-btn>
			</b-button-group>
			<b-button-group class="mx-1">
				<b-btn @click.stop="deselectDir(cwd)" v-if="cwd in selectedDirs">remove directory</b-btn>
				<b-btn @click.stop="selectDir(cwd)" :disabled="isSelectedDeep" v-else>add directory</b-btn>
			</b-button-group>
			<b-breadcrumb :items="breadcrumbs" class="my-0 p-2"/>
		</b-button-toolbar>

		<filetree :self="cwd" :children="directories" @opendir="openDir"></filetree>

		<b-table :fields="fileFields" :items="files" show-empty empty-text="no files in this directory" small hover>
			<template slot="actions" slot-scope="data">
				<b-btn size="sm" @click.stop="deselect(data.item.id)" :class="{ 'btn-outline-primary': isSelectedDeep }" class="mr-2" :disabled="isSelectedDeep" v-if="data.item.id in selected">remove</b-btn>
				<b-btn size="sm" @click.stop="select(data.item.id)" :class="{ 'btn-outline-primary': isSelectedDeep }" class="mr-2" :disabled="isSelectedDeep" v-else>{{ isSelectedDeep ? "selected" : "add" }}</b-btn>
				<b-btn size="sm" @click.stop="data.toggleDetails" :pressed.sync="data.detailsShowing" class="mr-2">details</b-btn>
				<b-btn size="sm" @click.stop="edit(data.item, data.index, $event.target)" class="mr-2">edit</b-btn>
			</template>
			<template slot="row-details" slot-scope="data">
				<b-card>
					<b-row class="mb-2">
						<b-col sm="3" class="text-sm-right"><b>title:</b></b-col>
						<b-col>{{ data.item.file_characteristics['title'] }}</b-col>
					</b-row>
					<b-row class="mb-2">
						<b-col sm="3" class="text-sm-right"><b>description:</b></b-col>
						<b-col>{{ data.item.file_characteristics['description'] }}</b-col>
					</b-row>
					<b-row class="mb-2">
						<b-col sm="3" class="text-sm-right"><b>encoding:</b></b-col>
						<b-col>{{ data.item.file_characteristics['encoding'] }}</b-col>
					</b-row>
					<b-row class="mb-2">
						<b-col sm="3" class="text-sm-right"><b>format:</b></b-col>
						<b-col>{{ data.item.file_format }}</b-col>
					</b-row>
					<b-row class="mb-2">
						<b-col sm="3" class="text-sm-right"><b>application name:</b></b-col>
						<b-col>{{ data.item.file_characteristics['application_name'] }}</b-col>
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

		<!--
		<ul v-if="files.length">
			<li v-for="file in files">
				{{ file }}
			</li>
			<file :id="file.id" :fileName="file.file_name" :identifier="file.identifier" :data="file" :modalOpen="modalOpen" v-for="file in files" :key="file.id"/>
		</ul>
		<p v-else>no files</p>
		//-->

		</div>
</template>

<script>
import vFile from './file.vue'
import vTree from './tree.vue'
import vFileInfoModal from './fileinfo-modal.vue'
import vFileEditModal from './fileedit-modal.vue'
import axios from 'axios'
import dateFromIso from 'date-fns/parse'
import dateFormat from 'date-fns/format'

var fileapi = axios.create({
	baseURL: 'https://metax-test.csc.fi/rest/',
	timeout: 3000,
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
//const API_PROJECT_ROOT_URL = "https://metax-test.csc.fi/rest/directories/root"
//const API_DIR_URL = "https://metax-test.csc.fi/rest/directories/"

export default {
	name: "filelist",
	props: ['project', 'root', 'path'],
	data: function() {
		return {
			error: null,
			selectedOnly: true,
			directories: [],
			files: [],
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
					label: "Created",
					formatter: (value) => { return dateFormat(dateFromIso(value), 'YYYY-MM-DD') },
				},
				{
					key: 'date_modified',
					label: "Modified",
					formatter: (value) => { return dateFormat(dateFromIso(value), 'YYYY-MM-DD') },
				},
				{
					key: 'byte_size',
					label: "Size",
				},
				'actions',
			],
			filter: null,
			modalEditFile: { title: "", description: "", content: "", state: null },
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
			if (typeof dir !== 'string') {
				console.warn("dir is not a string:", typeof dir, dir)
			}
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
			this.$store.commit('files/addFile', {project: this.project, path: id})
		},
		deselect: function(id) {
			console.log("deselecting file with id:", id)
			this.$store.commit('files/removeFile', {project: this.project, path: id})
		},
		selectDir: function(id) {
			console.log("selecting dir with id:", id)
			this.$store.commit('files/addDir', {project: this.project, path: id})
		},
		deselectDir: function(id) {
			console.log("selecting dir with id:", id)
			this.$store.commit('files/removeDir', {project: this.project, path: id})
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
			return this.$store.getters['files/getSelectedFiles'](this.project)
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
		'fileedit-modal': vFileEditModal,
	},
	created: function() {
		//if (this.project != "project_x") { return }
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
</script>
