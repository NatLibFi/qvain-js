<template>
	<div>
		<b-dropdown text="Change project" class="my-3">
			<b-dropdown-item v-for="proj in projects" :key="proj" @click="updateProject(proj)">
				Project {{proj}}
			</b-dropdown-item>
		</b-dropdown>

		<b-alert :show="hasFilesFromOtherProject" variant="danger">
			You may only select files from one project. You may browse other project but adding files is disabled. Remove selected files to change project.
		</b-alert>

		<div v-if="selectedProject">
			<b-row no-gutters>
				<b-col class="bg-primary py-3 px-4 d-flex justify-content-between">
					<h1 class="text-white">Project {{ selectedProject }}</h1>
				</b-col>
			</b-row>

			<Browser
				:selected="selectedByIdentifiers"
				:project="selectedProject"
				:disabled="hasFilesFromOtherProject"
				@select="addFileOrDirectory"
				@remove="removeFileOrDirectory" />
		</div>

		<div class="my-2">
			<div class="px-2 py-2 d-flex justify-content-between">
				<h3>Selected items</h3>
			</div>
			<b-card v-if="state.directories.length === 0 && state.files.length === 0" class="text-center bg-light">No files added</b-card>
			<b-card v-else no-body>
				<div v-for="category in Object.keys(state)" :key="category">
					<FileItem v-for="item in state[category]"
						:key="item.identifier"
						:single="item"
						:type="category"
						:secondary="item.identifier"
						:icon="icons[category]"
						@delete="removeFileOrDirectory"/>
				</div>
			</b-card>
		</div>
	</div>
</template>

<script>

import Browser from './Browser'
import FileItem from './FileItem.vue'

import { faFile, faFolder } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

const metaxAPI = axios.create({
	baseURL: process.env.VUE_APP_METAX_API_URL || '/api/proxy',
	timeout: 3000,
	responseType: 'json',
})

export default {
	name: 'filepicker',
	components: {
		Browser,
		FileItem,
	},
	data() {
		return {
			error: null,
			icons: {
				files: faFile,
				directories: faFolder,
			},
			state: {
				directories: [],
				files: [],
			},
			project: null,
		}
	},
	methods: {
		addFileOrDirectory({ type, fields }) {
			fields.use_category = {
				"in_scheme": undefined,
				"identifier": "http://uri.suomi.fi/codelist/fairdata/use_category/code/outcome",
				"pref_label": {
					"fi": "Tulosaineisto",
					"en": "Outcome material",
					"und": "Tulosaineisto"
				}
			}

			if (type === 'files') {
				fields.description = fields.description ? fields.description : 'File'
				this.state.files.push(fields)
			} else {
				fields.description = fields.description ? fields.description : 'Folder'
				this.state.directories.push(fields)
			}
			this.project = this.selectedProject
		},
		removeFileOrDirectory({ type, fields }) {
			if (type === 'files') {
				this.$set(this.state, 'files', this.state.files.filter(f => f.identifier !== fields.identifier))
			} else {
				this.$set(this.state, 'directories', this.state.directories.filter(d => d.identifier !== fields.identifier))
			}

			if (this.selectedByIdentifiers.length === 0) {
				this.project = null
			}
		},


		updateProject(project) {
			this.$router.push({ name: 'files', params: { project } })
		},

		loadFilesAndFoldersFromStore() {
			this.state.files = this.$store.state.record.files || []
			this.state.directories = this.$store.state.record.directories || []
		},
	},
	computed: {
		projects() {
			return this.$auth.user.projects || []
			//return ['project_x', '2001036'] // this is only for development purpose
		},
		selectedProject() {
			const { project: projectIDInRoute } = this.$route.params
			const usersFirstProject = this.$auth.user.projects[0]

			// add current store project before userFirstProject
			return projectIDInRoute || this.project || usersFirstProject || null
		},
		selectedByIdentifiers() {
			const { directories, files } = this.state
			return [...directories, ...files].map(item => item.identifier)
		},
		hasFilesFromOtherProject() {
			return this.project && this.project !== this.selectedProject
		},
	},
	async created() {
		this.loadFilesAndFoldersFromStore()
		// deny adding files outside current project of selected files
		try {
			if (this.state.files.length > 0) {
				const identifier = this.state.files[0].identifier
				const { data } = await metaxAPI.get(`/files/${identifier}`)
				const project = data.project_identifier

				this.project = project
			} else if (this.state.directories.length > 0) {
				const identifier = this.state.directories[0].identifier
				const { data } = await metaxAPI.get(`/directories/${identifier}/files`)
				const project = (data.directories && data.directories[0] && data.directories[0].project_identifier) ||
					(data.files && data.files[0] && data.files[0].project_identifier) || null

				this.project = project
			}
		} catch(e) {
			console.log('error retriving project', e)
		}
	},
	watch: {
		state: {
			deep: true,
			handler() {
				this.$store.commit('updateValue', {
					p: this.$store.state.record,
					prop: 'files',
					val: this.state.files,
				})
				this.$store.commit('updateValue', {
					p: this.$store.state.record,
					prop: 'directories',
					val: this.state.directories,
				})
			},
		},
	},
}
</script>
