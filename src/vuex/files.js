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
		selected: {},
		selectedDirs: {},
	},
	getters: {
		isSelected(state) {
			return (project, id) => (project in state.selected) && (id in state.selected[project])
		},
		getSelected(state) {
			return project => state.selected[project] || {}
		},
		getSelectedDirs(state) {
			return project => state.selectedDirs[project] || {}
		},
		prefixMatcher(state) {
			return (project, dir) => prefixmatchSet(dir, state.selectedDirs[project] || {})
		},
		/*
		isLoggedIn: function(state) {
			return state.loggedIn
		},
		getUserName: function(state) {
			return state.user
		},
		getProjects: function(state) {
			return Object.keys(state.projects)
		},
		*/
	},
	mutations: {
		addPath(state, location) {
			//if (! (location.project in state.selected)) state.selected[location.project] = {}
			if (! (location.project in state.selected)) Vue.set(state.selected, location.project, {})
			//state.selected[location.project][location.path] = true
			Vue.set(state.selected[location.project], location.path, true)
		},
		removePath(state, location) {
			if (! (location.project in state.selected)) return
			//delete state.selected[location.project][location.path]
			Vue.delete(state.selected[location.project], location.path)
			if (Object.keys(state.selected[location.project]).length < 1) {
				//delete state.selected[location.project]
				Vue.delete(state.selected, location.project)
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
