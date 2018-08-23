// vuex module for file selection
import Vue from 'vue'
import { stat } from 'fs'
import axios from 'axios'

var fileapi = axios.create({
  baseURL: 'https://metax-test.csc.fi/rest/',
  timeout: 3000,
  responseType: 'json',
})

const checkSelectedFile = (state, id) => {
  return (
    state.project in state.selectedFiles &&
    id in state.selectedFiles[state.project]
  )
}

const checkSelectedDir = (state, id) => {
  return (
    state.project in state.selectedDirs &&
    id in state.selectedDirs[state.project]
  )
}

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
      selected: checkSelectedFile(state, file.identifier),
      identifier: file.identifier,
      name: file.file_name,
      path: file.file_path,
      byte_size: file.byte_size,
      date_modified: file.file_modified,
      file: {
        file_format: file.file_format,
        open_access: file.open_access,
        file_characteristics: file.file_characteristics,
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
      selected: checkSelectedDir(state, folder.identifier),
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
    selectedFiles: {},
    selectedDirs: {},
    pickedItems: 0,
    directory: {},
    project: null,
    allDirs: { files: [], directories: [] },
  },
  getters: {
    isSelectedFile(state) {
      return id =>
        state.project in state.selectedFiles &&
        id in state.selectedFiles[state.project]
    },
    isSelectedDir(state) {
      return id =>
        state.project in state.selectedDirs &&
        id in state.selectedDirs[state.project]
    },
    getSelectedFiles(state) {
      return state.selectedFiles[state.project] || false
    },
    getSelectedDirs(state) {
      return state.selectedDirs[state.project] || false
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
      Vue.set(state, project, project)
    },
    // state.directory only has current folder
    // so this won't work if the folder is changed
    addFiles(state, items) {
      if (!(state.project in state.selectedFiles))
        Vue.set(state.selectedFiles, state.project, [])
      const selectedItems = items.map(single => {
        return state.allDirs.files.find(
          file => file.identifier === single.identifier,
        )
      })
      state.selectedFiles[state.project].push(...selectedItems)
    },
    removeFile(state, identifier) {
      if (!(state.project in state.selectedFiles)) return
      const index = state.selectedFiles[state.project].findIndex(
        single => single.identifier === identifier,
      )
      state.selectedFiles[state.project].splice(index, 1)
      if (state.selectedFiles[state.project].length < 1) {
        Vue.delete(state.selectedFiles, state.project)
      }
      for (let property in state.directory) {
        if (state.directory.hasOwnProperty(property)) {
          state.directory[property].filter(single => {
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
      if (!(state.project in state.selectedDirs))
        Vue.set(state.selectedDirs, state.project, [])
      const selectedItems = items.map(single => {
        return state.allDirs.directories.find(
          dir => dir.identifier === single.identifier,
        )
      })
      state.selectedDirs[state.project].push(...selectedItems)
    },
    removeDir(state, identifier) {
      if (!(state.project in state.selectedDirs)) return
      const index = state.selectedDirs[state.project].findIndex(
        single => single.identifier === identifier,
      )
      state.selectedDirs[state.project].splice(index, 1)
      if (state.selectedDirs[state.project].length < 1) {
        Vue.delete(state.selectedDirs, state.project)
      }
      for (let property in state.directory) {
        if (state.directory.hasOwnProperty(property)) {
          state.directory[property].filter(single => {
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
      console.log('directory', data)
      // We only add data on the first time they are fetched
      // We don't want to overwrite the modified data
      if (!state.directory[dir]) {
        Vue.set(state.directory, dir, combine(state, data))
      }
    },
  },
  actions: {
    savePicked({ commit, state }) {
      let pickedItems = []
      for (let property in state.directory) {
        if (state.directory.hasOwnProperty(property)) {
          pickedItems.push(
            ...state.directory[property].filter(single => {
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
