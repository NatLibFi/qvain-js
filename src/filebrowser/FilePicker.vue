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
			<b-card v-if="state.dir.length === 0 && state.file.length === 0" class="text-center bg-light">No files added</b-card>
			<b-card v-else no-body>
				<div v-for="category in Object.keys(state)" :key="category">
					<FileItem v-for="item in state[category]"
						:key="item.identifier"
						:single="item"
						:type="category"
						:secondary="item.identifier"
						:icon="icons[category.type]"
						@delete="removeFileOrDirectory"
						:openModal="() => modalOpen(item)" />
				</div>
			</b-card>
		</div>

		<!--
		<FileEditModal ref="refFileEditModal" />
		<FileInfoModal ref="refFileInfoModal" />
		-->
	</div>
</template>

<script>

import Browser from './Browser';
import FileItem from './FileItem.vue';
import FileEditModal from './FileEditModal.vue';
import FileInfoModal from './fileinfo-modal';

import { faFile, faFolder } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

export default {
	name: 'filepicker',
	components: {
		Browser,
		FileEditModal,
		FileInfoModal,
		FileItem,
	},
	data() {
		return {
			error: null,
			icons: {
				file: faFile,
				dir: faFolder,
			},
			state: {
				dir: [],
				file: [],
			},
		}
	},
	methods: {
		addFileOrDirectory(item) {
			if (item.type === 'file') {
				this.state.file.push(item);
			} else {
				this.state.dir.push(item);
			}
		},
		removeFileOrDirectory(item) {
			if (item.type === 'file') {
				this.state.file = this.state.file.filter(f => f.identifier !== item.identifier);
			} else {
				this.state.dir = this.state.dir.filter(d => d.identifier !== item.identifier);
			}
		},


		updateProject(project) {
			this.$router.push({ name: 'files', params: { project } });
		},

		loadFilesAndFoldersFromStore() {
			this.state = this.$store.state.record.files;
		},

		modalOpen() {
			debugger
			// TODO: what is this?
			//return this.$refs.refFileEditModal.show.apply(this, arguments)
		},
	},
	computed: {
		projects() {
			//return this.$auth.user.projects || []
			return ['project_x', '2001036']; // TODO: remove this!!
		},
		selectedProject() {
			const { project: projectIDInRoute } = this.$route.params;
			const usersFirstProject = this.$auth.user.projects[0];

			// add current store project before userFirstProject
			return projectIDInRoute || usersFirstProject || null;
		},
		selectedByIdentifiers() {
			const { dir, file } = this.state;
			return [...dir, ...file].map(item => item.identifier);
		},
		hasFilesFromOtherProject() {
			const { dir, file } = this.state;
			const oldProject = (dir[0] || file[0] || {}).project;
			return oldProject && oldProject !== this.selectedProject;

			//return [...dir, ...file].some(item => item.project !== this.selectedProject);
		}
	},
	created() {
		// deny adding files outside current project of selected files
	},
	watch: {
		state: {
			deep: true,
			handler() {
				this.$store.commit('updateValue', {
					p: this.$store.state.record,
					prop: 'files',
					val: this.state
				});
			}
		}
	},
}
</script>
