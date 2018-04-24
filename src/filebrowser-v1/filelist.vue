<template>
	<div>
		<fileinfo-modal ref="refFileInfoModal"></fileinfo-modal>

		file list for <b>{{ project }}</b> path <b>{{ path }}</b> cur <b>{{ curId }}</b> name <b>{{ curName || "/" }}</b> up <b><a @click="setCurDirectory(curParentId)">{{ curParentId || 'null' }}</a></b>
		deep: {{ isSelectedDeep }}
		
		<ul v-if="directories.length">
			<li v-for="dir in directories" :key="dir">
				<a @click="setCurDirectory(dir)">{{ dir.directory_name }}</a> ({{ dir.id }} {{ dir.identifier }})
			</li>
		</ul>
		<p v-else>no directories</p>
		
		<hr/>
		<b-breadcrumb :items="breadcrumbs"/>
		<hr/>
		
		<b-button-toolbar key-nav aria-label="File browser toolbar">
			<b-button-group class="mx-1">
				<b-btn v-b-tooltip.hover title="go to project top directory" @click="curId = rootId"><i class="fa fa-angle-double-up" aria-hidden="true"></i></b-btn>
				<b-btn v-b-tooltip.hover title="go up one level" @click="curId = curParentId" :disabled="curParentId === null"><i class="fa fa-angle-up" aria-hidden="true"></i></b-btn>
			</b-button-group>
			<b-button-group class="mx-1">
				<b-btn @click.stop="deselectDir(currentPath)" v-if="currentPath in selectedDirs">remove directory</b-btn>
				<b-btn @click.stop="selectDir(currentPath)" :disabled="isSelectedDeep" v-else>add directory</b-btn>
			</b-button-group>
		</b-button-toolbar>
		
		<b-table :fields="fileFields" :items="files" show-empty empty-text="no files in this directory" small hover>
			<template slot="actions" slot-scope="data">
				<b-btn size="sm" @click.stop="deselect(data.item.id)" :class="{ 'btn-outline-primary': isSelectedDeep }" :disabled="isSelectedDeep" v-if="data.item.id in selected">remove</b-btn>
				<b-btn size="sm" @click.stop="select(data.item.id)" :class="{ 'btn-outline-primary': isSelectedDeep }" :disabled="isSelectedDeep" v-else>{{ isSelectedDeep ? "selected" : "add" }}</b-btn>
			</template>
		</b-table>
		
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
import vFileInfoModal from './fileinfo-modal.vue'
import axios from 'axios'
import dateFromIso from 'date-fns/parse'
import dateFormat from 'date-fns/format'

// https://metax-test.csc.fi/rest/directories/root?project=project_x
const API_PROJECT_ROOT_URL = "https://metax-test.csc.fi/rest/directories/root"
const API_DIR_URL = "https://metax-test.csc.fi/rest/directories/"

export default {
	name: "filelist",
	props: ['project', 'root', 'path'],
	data: function() {
		return {
			something: "",
			directories: [],
			files: [],
			error: null,
			rootId: null,
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
		makeApiUrl: function(id) {
			return API_DIR_URL + id + "/files"
		},
		setCurDirectory(dir) {
			this.curName = dir.directory_name
			//this.curParentId = dir['parent_directory'] && dir.parent_directory['id'] || null
			this.curId = dir.id
		},
		getRootFor: function(project) {
			var v = this
			
			console.log("getting root for project", project)
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
		getDirInfo: function() {
			// NOTE: remove this when the api changes
			var v = this
			
			axios.get(API_DIR_URL + v.curId)
				.then(function (response) {
					v.curDirInfo = response.data
				})
				.catch(function (error) {
					v.curDirInfo = null
					console.log(error)
				})
		},
		//https://metax-test.csc.fi/rest/directories/4
		getFilesFor: function(directory) {
			var v = this
			
			console.log("getting files for directory id", directory)
			axios.get(API_DIR_URL + v.curId + "/files")
				.then(function (response) {
					console.log("status:", response.status)
					v.processResponse(response.data, v.$data)
				})
				.catch(function (error) {
					console.log(error)
				})
		},
		processRoot: function(response, data) {
			if (!('id' in response)) data.error = "empty"
			console.log("root id:", response.id)
			data.rootId = data.curId = response.id
		},
		processResponse: function(response, data) {
			if (typeof response['directories'] !== 'object' || response.directories.length < 1) {
				data.directories = []
			} else {
				data.directories = response.directories.filter(d => 'directory_name' in d)
			}
			
			if (typeof response['files'] !== 'object' || response.files.length < 1) {
				data.files = []
			} else {
				data.files = response['files']
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
			if (!this.curDirInfo || !this.curDirInfo['directory_path']) return []
			return this.curDirInfo.directory_path.split('/')
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
			return this.$store.getters['files/prefixMatcher'](this.project, this.currentPath)
		},
		selected: function() {
			return this.$store.getters['files/getSelected'](this.project)
		},
		selectedDirs: function() {
			return this.$store.getters['files/getSelectedDirs'](this.project)
		},
	},
	watch: {
		curId: {
			immediate: true,
			handler(newDir, oldDir) {
				console.log("cur dir watcher ran", newDir, oldDir)
				if (newDir === null) { return }
				this.getFilesFor(newDir)
				this.getDirInfo(newDir)
			},
		},
	},
	components: {
		'file': vFile,
		'fileinfo-modal': vFileInfoModal,
	},
	created: function() {
		if (this.project != "project_x") { return }
		this.getRootFor(this.project)
		//console.log("root dir:", this.root)
		//this.getFilesFor(this.curId)
		console.log("filelist params:", this.project, this.root, this.path)
		//this.curId = this.root
		//this.getFilesFor(this.curId)
		console.log("store:", this.$store.getters)
	},
}
</script>
