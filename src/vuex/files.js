// vuex module for file selection
import Vue from 'vue'
import { stat } from 'fs'
import axios from 'axios'



let fileapi = axios.create({
	baseURL: process.env.VUE_APP_METAX_FILEAPI_URL || '/api/proxy',
	timeout: 3000,
	responseType: 'json',
})

const combine = (state, data, dir) => {
	// combines folders and files into single array of objects
	/*
    {
      type: ,
      identifier: ,
      name: ,
      path: ,
      parentPath: ,
      project: ,
      byte_size: ,
      date_modified: ,
      directory: {
        file_count: ,
      }
      file: {
        file_format?: ,
        open_access?: ,
        file_characteristics: ,
        checksum: ,
      }
    }
  */
	let parsedFiles = []
	let parsedFolders = []
	if (typeof data.files === 'object' && data.files.length > 0) {
		parsedFiles = data.files.map(file => ({
			type: 'file',
			picked: false,
			selected: false,
			project: state.project,
			parentPath: dir,
			identifier: file.identifier,
			name: file.file_name,
			path: file.file_path,
			byte_size: file.byte_size,
			date_modified: file.file_modified,
			file: {
				file_format: file.file_format,
				open_access: file.open_access,
				file_characteristics: file.file_characteristics || {},
				checksum: { value: file.checksum_value },
			},
			directory: undefined,
			// custom class for bootstrap table details
			_showDetails: false,
		}))
	}
	if (typeof data.directories === 'object' && data.directories.length > 0) {
		parsedFolders = data.directories.map(folder => ({
			type: 'dir',
			picked: false,
			selected: false,
			project: state.project,
			identifier: folder.identifier,
			name: folder.directory_name,
			path: folder.directory_path,
			byte_size: folder.byte_size,
			date_modified: folder.directory_modified,
			directory: {
				file_count: folder.file_count,
			},
			file: undefined,
			// custom class for bootstrap table details
			_showDetails: false,
		}))
	}
	console.log('files and folders', [...parsedFolders, ...parsedFiles])
	return [...parsedFolders, ...parsedFiles]
}

// TODO: Add functions to clear data from store when user is finished
export default {
	namespaced: true,
	state: {
		namesOfSelected: {},
		pickedItems: 0,
		projects: {},
		/*
    projects: {
      'project_x': {
        'path/to/folder1/': [
          {files and folders}
        ],
        'path/to/': [
          {files and folders}
        ]
      }
    }
    */
		project: null,
		allDirs: { files: [], directories: [] },
	},
	getters: {
		getSelectedFiles(state) {
			return state.selectedFiles || false
		},
		getSelectedDirs(state) {
			return state.selectedDirs || false
		},
		getProject(state) {
			return state.project
		},
	},
	mutations: {
		addPicked(state) {
			state.pickedItems += 1
		},
		removePicked(state) {
			state.pickedItems -= 1
		},
		clearPicked(state) {
			state.pickedItems = 0
		},
		updateProject(state, project) {
			console.log('update project', project)
			Vue.set(state, 'project', project)
		},
		addNames(state, items) {
			Vue.set(state, 'namesOfSelected', {...state.namesOfSelected, ...items})
		},
		removeName(state, identifier) {
			Vue.delete(state.namesOfSelected, identifier)
		},
		saveResults(state, { data, dir }) {
			// TODO: should not push data to allDirs if it is already there
			state.allDirs.files.push(...data.files)
			state.allDirs.directories.push(...data.directories)
			console.log('save results', data)
			// We only add data on the first time they are fetched
			// We don't want to overwrite the modified data
			if (!state.projects[state.project]) {
				Vue.set(state.projects, state.project, {})
			}
			if (!state.projects[state.project][dir]) {
				Vue.set(state.projects[state.project], dir, combine(state, data, dir))
			}
		},
	},
	actions: {
		savePicked({ commit, state, rootState }) {
			let pickedItems = []
			for (let property in state.projects[state.project]) {
				if (state.projects[state.project].hasOwnProperty(property)) {
					pickedItems.push(
						...state.projects[state.project][property].filter(single => {
							if (single.picked) {
								single.picked = false
								single.selected = true
								return true
							}
							return false
						}),
					)
				}
			}

			const recordFiles = []
			const recordDirs = []
			const names = {}

			// get picked files ready to store in record
			const parseItem = (single) => {
				const item = {
					identifier: single.identifier,
					title: single.file_characteristics ? single.file_characteristics.title : undefined,
					description: single.file_characteristics ? single.file_characteristics.description : undefined,
					use_category: undefined,
					// or something from mfs?
					access_url: undefined,
				}
				if (single.type === 'file') {
					item.file_type = undefined
				}
				return item
			}

			// save names separately. They will be displayed in ui but not stored in record
			const saveName = (item) => {
				names[item.identifier] = {name: item.name, path: item.parentPath, project: item.project}
			}

			const process = (item) => {
				item.type === 'file'
					? recordFiles.push(parseItem(item))
					: recordDirs.push(parseItem(item))
				saveName(item)
			}

			// loop through picked items and process them for saving to record
			pickedItems.map(single => {
				process(single)
			})

			console.log('rootState', rootState)
			if (recordFiles.length > 0) {
				commit('pushMultiple', {p: rootState.record, prop: 'files', val: recordFiles}, { root: true })
			}

			if (recordDirs.length > 0) {
				commit('pushMultiple', {p: rootState.record, prop: 'directories', val: recordDirs}, { root: true })
			}
			commit('addNames', names)
			commit('clearPicked')
		},
		removeItem({ commit, state, rootState }, {identifier, type, path, project}) {
			commit('removeName', identifier)
			commit('removeValue', {p: rootState.record, prop: type === 'file' ? 'files' : 'directories', val: identifier}, {root: true})
			console.log('projects,path', state.projects[project], path)
			state.projects[project][path].find(single => {
				if (single.identifier === identifier) {
					single.picked = false
					single.selected = false
					return true
				}
				return false
			})
		},
		queryContent({ commit, state }, { dir, project }) {
			return fileapi
				.get('/files', { params: { project, path: dir }})
				.then(response => { commit('saveResults', { data: response.data, dir }) });
		},
	},
}
