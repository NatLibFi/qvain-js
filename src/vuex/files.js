// vuex module for file selection
import Vue from 'vue'
import { stat } from 'fs'
import axios from 'axios'

var fileapi = axios.create({
  baseURL: 'https://metax-test.csc.fi/rest/',
  timeout: 3000,
  responseType: 'json',
})
// TODO: Add functions to clear data from store when user is finished
export default {
  namespaced: true,
  state: {
    selectedFiles: {},
    selectedDirs: {},
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
    getFilesAndFolders(state) {
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
      if (
        typeof state.directory.files === 'object' &&
        state.directory.files.length > 0
      ) {
        parsedFiles = state.directory.files.map(file => ({
          type: 'file',
          selected: false,
          identifier: file.identifier,
          name: file.file_name,
          path: file.file_path,
          byte_size: file.byte_size,
          date_modified: file.date_modified,
          file: {
            file_format: file.file_format,
            open_access: file.open_access,
            file_characteristics: file.file_characteristics,
            checksum: { value: file.checksum_value },
          },
          directory: undefined,
        }))
      }
      if (
        typeof state.directory.directories === 'object' &&
        state.directory.directories.length > 0
      ) {
        parsedFolders = state.directory.directories.map(folder => ({
          type: 'dir',
          selected: false,
          identifier: folder.identifier,
          name: folder.directory_name,
          path: folder.directory_path,
          byte_size: folder.byte_size,
          date_modified: folder.date_modified,
          directory: {
            file_count: folder.file_count,
          },
          file: undefined,
        }))
      }
      console.log('files and folders', [...parsedFolders, ...parsedFiles])
      return [...parsedFolders, ...parsedFiles]
    },
    getProject(state) {
      return state.project
    },
  },
  mutations: {
    updateProject(state, project) {
      state.project = project
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
      return
    },
    saveResults(state, data) {
      state.allDirs.files.push(...data.files)
      state.allDirs.directories.push(...data.directories)
      state.directory = data
    },
  },
  actions: {
    addSelected({ commit, state }, items) {
      let files = []
      let dirs = []
      items.map(single => {
        single.type === 'file' ? files.push(single) : dirs.push(single)
      })
      if (files.length > 0) {
        commit('addFiles', files)
      }
      if (dirs.length > 0) {
        commit('addDirs', dirs)
      }
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
            commit('saveResults', response.data)
            resolve(response.data)
          })
          .catch(function(error) {
            reject(error)
          })
      })
    },
  },
}
