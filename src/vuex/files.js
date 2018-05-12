// vuex module for file selection
import Vue from 'vue'


// check if path `p` is below one of the paths in array `arr`
// eslint-disable-next-line no-unused-vars
function prefixmatchArray(p, arr) {
	if (!p) return false
	
	var last = p.length
	do {
		// special case: re-include slash if we have to match root
		if (last == 0 && p.length && p[0] == '/') return arr.includes('/')
		if (arr.includes(p.slice(0, last))) return true
		last--
	}
	while ((last = p.lastIndexOf('/', last)) > 0)
	
	return false
}


// check if path `p` is below one of the paths in set or object `set`
function prefixmatchSet(p, set) {
	if (!p) return false
	
	var last = p.length
	do {
		// special case: re-include slash if we have to match root
		if (last == 0 && p.length > 0) return '/' in set
		if (p.slice(0, last) in set) return true
		last--
	}
	while ((last = p.lastIndexOf('/', last)) >= 0)
	
	return false
}


export default {
	namespaced: true,
	state: {
		selectedFiles: {},
		selectedDirs: {},
	},
	getters: {
		isSelected(state) {
			return (project, id) => (project in state.selected) && (id in state.selectedFiles[project])
		},
		getSelectedFiles(state) {
			return project => state.selectedFiles[project] || {}
		},
		getSelectedDirs(state) {
			return project => state.selectedDirs[project] || {}
		},
		prefixMatcher(state) {
			return (project, dir) => prefixmatchSet(dir, state.selectedDirs[project] || {})
		},
	},
	mutations: {
		addFile(state, location) {
			if (! (location.project in state.selectedFiles)) Vue.set(state.selectedFiles, location.project, {})
			Vue.set(state.selectedFiles[location.project], location.path, true)
		},
		removeFile(state, location) {
			if (! (location.project in state.selectedFiles)) return
			Vue.delete(state.selectedFiles[location.project], location.path)
			if (Object.keys(state.selected[location.project]).length < 1) {
				Vue.delete(state.selectedFiles, location.project)
			}
			return
		},
		addDir(state, location) {
			if (! (location.project in state.selectedDirs)) Vue.set(state.selectedDirs, location.project, {})
			Vue.set(state.selectedDirs[location.project], location.path, true)
		},
		removeDir(state, location) {
			if (! (location.project in state.selectedDirs)) return
			Vue.delete(state.selectedDirs[location.project], location.path)
			if (Object.keys(state.selectedDirs[location.project]).length < 1) {
				Vue.delete(state.selectedDirs, location.project)
			}
			return
		},
	},
}
