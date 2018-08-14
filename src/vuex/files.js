// vuex module for file selection
import Vue from 'vue'
import { stat } from 'fs'
import axios from 'axios'

var fileapi = axios.create({
  baseURL: 'https://metax-test.csc.fi/rest/',
  timeout: 3000,
  responseType: 'json',
})

export default {
  namespaced: true,
  state: {
    selectedFiles: {},
    selectedDirs: {},
    directory: {},
  },
  getters: {
    isSelectedFile(state) {
      return (project, id) =>
        project in state.selectedFiles && id in state.selectedFiles[project]
    },
    isSelectedDir(state) {
      return (project, id) =>
        project in state.selectedDirs && id in state.selectedDirs[project]
    },
    getSelectedFiles(state) {
      return project => state.selectedFiles[project] || false
    },
    getSelectedDirs(state) {
      return project => state.selectedDirs[project] || false
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
      return [...parsedFolders, ...parsedFiles]
    },
  },
  mutations: {
    addFiles(state, data) {
      if (!(data.project in state.selectedFiles))
        Vue.set(state.selectedFiles, data.project, [])
      const selectedItems = data.items.map(single => {
        return state.directory.files.find(
          file => file.identifier === single.identifier,
        )
      })
      state.selectedFiles[data.project].push(...selectedItems)
    },
    removeFile(state, project, item) {
      if (!(location.project in state.selectedFiles)) return
      Vue.delete(state.selectedFiles[location.project], location.path)
      if (Object.keys(state.selectedFiles[location.project]).length < 1) {
        Vue.delete(state.selectedFiles, location.project)
      }
      return
    },
    addDirs(state, data) {
      if (!(data.project in state.selectedDirs))
        Vue.set(state.selectedDirs, data.project, [])
      const selectedItems = data.items.map(single => {
        return state.directory.directories.find(
          dir => dir.identifier === single.identifier,
        )
      })
      state.selectedDirs[data.project].push(...selectedItems)
    },
    removeDir(state, location) {
      if (!(location.project in state.selectedDirs)) return
      Vue.delete(state.selectedDirs[location.project], location.path)
      if (Object.keys(state.selectedDirs[location.project]).length < 1) {
        Vue.delete(state.selectedDirs, location.project)
      }
      return
    },
    saveResults(state, data) {
      state.directory = data
    },
  },
  actions: {
    addSelected({ commit, state }, data) {
      let files = []
      let dirs = []
      data.items.map(single => {
        single.type === 'file' ? files.push(single) : dirs.push(single)
      })
      if (files.length > 0) {
        commit('addFiles', { project: data.project, items: files })
      }
      if (dirs.length > 0) {
        commit('addDirs', { project: data.project, items: dirs })
      }
    },
    queryContent({ commit, state }, data) {
      console.log('query', data)
      return new Promise((resolve, reject) => {
        fileapi
          .get('/directories/files', {
            params: {
              project: data.project,
              path: data.dir,
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
