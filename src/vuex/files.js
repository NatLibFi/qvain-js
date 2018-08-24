// vuex module for file selection
import Vue from 'vue'
import { stat } from 'fs'
import axios from 'axios'

var fileapi = axios.create({
  baseURL: 'https://metax-test.csc.fi/rest/',
  timeout: 3000,
  responseType: 'json',
})

const combine = (state, data) => {
  // combines folders and files into single array of objects
  /*
    {
      type: ,
      identifier: ,
      name: ,
      path: ,
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
    selectedFiles: [],
    selectedDirs: [],
    pickedItems: 0,
    projects: {},
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
    // state.projects[state.project] only has current folder
    // so this won't work if the folder is changed
    addFiles(state, items) {
      const selectedItems = items.map(single => {
        return {
          ui: {
            name: single.name,
          }, 
          identifier: single.identifier,
          title: single.file_characteristics ? single.file_characteristics.title : undefined,
          description: single.file_characteristics ? single.file_characteristics.description : undefined,
          use_category: undefined,
          file_type: undefined,
          // or something from mfs?
          access_url: undefined,
        }
      })
      state.selectedFiles.push(...selectedItems)
    },
    removeFile(state, identifier) {
      const index = state.selectedFiles.findIndex(
        single => single.identifier === identifier,
      )
      state.selectedFiles.splice(index, 1)
      for (let property in state.projects[state.project]) {
        if (state.projects[state.project].hasOwnProperty(property)) {
          state.projects[state.project][property].filter(single => {
            if (single.identifier === identifier) {
              single.picked = false
              single.selected = false
            }
          })
        }
      }
      return
    },
    addDirs(state, items) {
      const selectedItems = items.map(single => {
        return {
          ui: {
            name: single.name,
          }, 
          identifier: single.identifier,
          title: undefined,
          description: undefined,
          use_category: undefined,
          // or something from mfs?
          access_url: undefined,
        }
      })
      state.selectedDirs.push(...selectedItems)
    },
    removeDir(state, identifier) {
      const index = state.selectedDirs.findIndex(
        single => single.identifier === identifier,
      )
      state.selectedDirs.splice(index, 1)
      for (let property in state.projects[state.project]) {
        if (state.projects[state.project].hasOwnProperty(property)) {
          state.projects[state.project][property].filter(single => {
            if (single.identifier === identifier) {
              single.picked = false
              single.selected = false
            }
          })
        }
      }
      return
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
        Vue.set(state.projects[state.project], dir, combine(state, data))
      }
    },
  },
  actions: {
    savePicked({ commit, state }) {
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
      let files = []
      let dirs = []
      pickedItems.map(single => {
        single.type === 'file' ? files.push(single) : dirs.push(single)
      })
      if (files.length > 0) {
        commit('addFiles', files)
      }
      if (dirs.length > 0) {
        commit('addDirs', dirs)
      }
      commit('clearPicked')
    },
    queryContent({ commit, state }, { dir, project }) {
      return new Promise((resolve, reject) => {
        fileapi
          .get('/directories/files', {
            params: {
              project,
              path: dir,
            },
          })
          .then(function(response) {
            commit('saveResults', { data: response.data, dir })
            resolve(response.data)
          })
          .catch(function(error) {
            reject(error)
          })
      })
    },
  },
}

/*
{
  files: [
    {
      identifier: ,
      title: ,
      description: ,
      use_category: ,
      file_type: ,
      access_url: ,
    }
  ],
  directories: [
    {
      identifier: ,
      title: ,
      description: ,
      use_category: ,
      access_url: ,
    }
  ]
}
*/