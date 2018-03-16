import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


//import { SchemaValidator } from '../tmp/json-schema-live/src/validate.js'


var buildTree = function(schema) {
}


export default new Vuex.Store({
	state: {
		//record: "not loaded",
		record: undefined,
		schema: "not loaded",
		hints: {},
        tabui: {},
		validation: {},
		stats: {
			total: 0,
			pass: 0,
			fail: 0,
			q: 0,
		},
	},
	mutations: {
		loadData(state, record) {
			state.record = record
			//Vue.set(state, 'record', record)
		},
		loadSchema(state, schema) {
			state.schema = schema
			//state.schema = Vue.set(state, 'schema', schema)
		},
		loadHints(state, hints) {
			//state.hints = hints
			Vue.set(state, 'hints', hints)
		},
		setHints(state, payload) {
			//state.hints[payload.path] = payload.hints
			Object.keys(payload.hints).forEach((key) => (payload.hints[key] == null || payload.hints[key] == undefined) && delete payload.hints[key])
			Vue.set(state.hints, payload.path, payload.hints)
		},
		setHint(state, payload) {
			//state.hints[payload.path] = payload.hint
			Vue.set(state.hints, payload.path, payload.hint)
		},
		delHints(state, payload) {
			Vue.delete(state.hints[payload.path])
		},
        addTab(state, payload) {
            Vue.set(state.tabui, payload.tab, payload.schema)
        },
		init(state) {
			state.validation = buildTree(state.schema)
		},
		//updateValue(state, {par, prop, value}) {
		updateValue(state, payload) {
			console.log("store update for", payload.p, "payload:", payload)
			//payload.p[payload.prop] = payload.val
			Vue.set(payload.p, payload.prop, payload.val)
		},
		/*
		setValue(state, payload) {
			console.log("store update for", payload.old, "to:", payload.new)
			payload.old = payload.new
		},
		*/
		updateStats(state, payload) {
			state.stats = payload
		},
	},
	getters: {
		uiForPath: (state) => (path) => {
			return state.hints[path] || {}
		},
	},
})
