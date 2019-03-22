<template>
	<div>
		<b-alert :show="!!error" variant="danger">
			{{ error }}

			<div :style="{'margin-top': '15px'}" align="center">
				<b-btn @click="openDirectory">Retry</b-btn>
			</div>
		</b-alert>
		<!-- BREADCRUMBS AND TOOLBAR -->
		<b-button-toolbar key-nav aria-label="File browser toolbar" class="d-flex align-items-center">
			<Breadcrumbs :breadcrumbs="breadcrumbs" :click="goTo" class="mr-auto" homePath="/" />
		</b-button-toolbar>

		<!-- TABLE -->
		<b-table :fields="fields" :items="filesAndDirectoriesForCWD" show-empty empty-text="no files in this directory" striped hover class="mb-0"> <!-- :tbody-tr-class="rowClass" @row-clicked="toggleSelection" -->

			<template slot="selection" slot-scope="data">
				<b-form-checkbox v-if="!disabled" class="m-0" :checked="selected.includes(data.item.identifier)" @change="e => togglePick(e, data)" />
			</template>

			<template slot="type" slot-scope="data">
				<b-btn v-if="data.item.type !== 'files'" size="sm" @click.stop="goTo(data.item.path)" variant="link" class="m-0 p-0 float-right">
					<font-awesome-icon :icon="icon.faFolder" size="2x" />
				</b-btn>
			</template>

			<template slot="name" slot-scope="data">
				<b-btn v-if="data.item.type !== 'files'" variant="link" @click.stop="goTo(data.item.path)" class="m-0 p-0">{{data.item.name}}</b-btn>
				<span v-else>{{data.item.name}}</span>
			</template>

			<template slot="actions" slot-scope="data">
				<div v-if="data.item.type === 'files'">
					<b-btn size="sm" @click.stop="data.toggleDetails" class="mr-2">{{ data.detailsShowing ? 'Hide' : 'Show'}} Details</b-btn>
				</div>
			</template>

			<template slot="row-details" slot-scope="data">
				<b-card class="cursor-reset bg-light">
					<h4>Details</h4>
					<table class="table-sm table-borderless w-100 mb-3">
						<thead class="">
							<th>title</th>
							<th>encoding</th>
							<th>format</th>
							<th>application name</th>
						</thead>

						<tr class="bg-transparent">
							<td>{{ data.item.file.file_characteristics['title'] }}</td>
							<td>{{ data.item.file.file_characteristics['encoding'] }}</td>
							<td>{{ data.item.file.file_format }}</td>
							<td>{{ data.item.file.file_characteristics['application_name'] }}</td>
						</tr>
					</table>

					<div class="d-flex justify-content-between">
						<div>
							<p class="mt-2 mb-2"><b>description</b></p>
							<p>{{ data.item.file.file_characteristics['description'] }}</p>
						</div>
						<b-btn-group class="align-self-end">
							<b-button @click.stop="data.toggleDetails " :pressed.sync="data.detailsShowing "
								variant="secondary" class="w-100 h-100">hide</b-button>
							<b-button @click.stop="()=> modalOpen(data.item.identifier, data.item.path, project)"
								variant="primary" class="w-100 h-100">json</b-button>
						</b-btn-group>
					</div>
				</b-card>
			</template>
		</b-table>
	</div>
</template>

<script>
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faFolder } from '@fortawesome/free-solid-svg-icons'

import Breadcrumbs from './breadcrumbs.vue'
import dateFormat from 'date-fns/format'

const fileAPI = axios.create({
	baseURL: process.env.VUE_APP_METAX_FILEAPI_URL || '/api/proxy',
	timeout: 3000,
	responseType: 'json',
})

const formatBytes = (bytes, decimals) => {
	if (bytes == 0) return '0 Bytes'
	const k = 1024,
		dm = decimals || 2,
		sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
		i = Math.floor(Math.log(bytes) / Math.log(k))
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export default {
	name: 'browser',
	props: ['project', 'selected', 'disabled'],
	components: {
		Breadcrumbs,
		FontAwesomeIcon,
	},
	data() {
		return {
			fields: [
				{
					key: 'selection',
					label: '',
					class: 'pl-3 pr-0 mx-0',
					thStyle: { width: '0em' },
					tdClass: 'align-middle',
				},
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
						return dateFormat(value, 'YYYY-MM-DD')
					},
					tdClass: 'align-middle',
				},
				{
					key: 'byte_size',
					label: 'Size',
					sortable: true,
					tdClass: 'align-middle',
					formatter: value => {
						return formatBytes(value)
					},
				},
				{
					key: 'actions',
					label: '',
				},
			],
			icon: {
				faFolder,
			},
			error: null,
			directory: {
				directories: [],
				files: [],
			},
		}
	},
	methods: {
		goTo(path) {
			this.$router.push({
				name: 'files',
				params: {
					project: this.project,
					relpath: path,
				},
			})
		},
		async openDirectory() {
			try {
				this.error = null
				const { data } = await fileAPI.get('/directories/files', {
					params: { project: this.project, path: this.path },
				})
				this.directory = data
			} catch (error) {
				console.log(error)
				this.error = 'Qvain was not able to open the requested directory. Please retry or naviagte to another directory. Refreshing page will forfeit your data.'
			}
		},
		togglePick(state, data) {
			const description = data.item.file_characteristics ?
				data.item.file_characteristics.description : ''

			const title = data.item.file_characteristics ?
				data.item.file_characteristics.title :
				data.item.name

			const fields = {
				identifier: data.item.identifier,
				use_category: data.item.use_category,
				title,
				description,
			}
			if (state) {
				this.$emit('select', { type: data.item.type, fields })
			} else {
				this.$emit('remove', { type: data.item.type, fields })
			}
		},
	},
	computed: {
		path() {
			const { relpath } = this.$route.params
			if (!relpath) {
				return '/'
			}
			if (relpath.charAt(0) === '/') {
				return relpath
			}
			return '/' + relpath
		},
		breadcrumbs() {
			return this.path.split('/').reduce((acc, path, index) => {
				acc[index] = {}
				acc[index].label = path
				acc[index].to = index === 0 ? [path] : [...acc[index -1].to, path]
				return acc
			}, [])
				.map(value => ({ label: value.label, to: value.to.join('/') }))
		},
		filesAndDirectoriesForCWD() {
			const mapToInternalValues = type => item => {
				// _showDetails is custom class for bootstrap table details
				const base = { type, parentPath: this.path, _showDetails: false }
				const shared = {
					identifier: item.identifier,
					project: item.project_identifier,
					byte_size: item.byte_size,
				}

				const directory = {
					name: item.directory_name,
					path: item.directory_path,
					date_modified: item.directory_modified,
					directory: {
						file_count: item.file_count,
					},
					file: undefined,
				}

				const file = {
					name: item.file_name,
					path: item.file_path,
					date_modified: item.file_modified,
					file: {
						file_format: item.file_format,
						open_access: item.open_access,
						file_characteristics: item.file_characteristics || {},
						checksum: { value: item.checksum_value },
					},
					directory: undefined,
				}

				return Object.assign(base, shared, type === 'files' ? file : directory)
			}

			return [
				...(this.directory.directories || []).map(mapToInternalValues('directories')),
				...(this.directory.files || []).map(mapToInternalValues('files')),
			]
		},
	},
	watch: {
		path() {
			this.openDirectory()
		},
		project: {
			immediate: true,
			handler() {
				if (this.project) {
					this.openDirectory()
				}
			},
		},
	},
}
</script>
