import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


//import { SchemaValidator } from '../tmp/json-schema-live/src/validate.js'


export default new Vuex.Store({
	state: {
		//record: "not loaded",
		record: undefined,
		schema: "not loaded",
		hints: {},
		metadata: {},
		UI_VALID_KEYWORDS: [
			'widget',
			'option',
			'label',
			'help',
			'placeholder',
			'tab'
		],
		tabui: {},
		validation: {},
		vState: {},
		stats: {
			total: 0,
			pass: 0,
			fail: 0,
			q: 0,
		},
	},
	mutations: {
		setMetadata(state, payload) {
			state.metadata = Object.assign({}, state.metadata, payload)
		},
		resetMetadata(state) {
			state.metadata = {}
		},
		loadData(state, record) {
			state.record = record
			//Vue.set(state, 'record', record)
		},
		mergeData(state, payload) {
			for (let key in payload) {
				Vue.set(state.record, key, payload[key])
			}
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
		initValue(state, payload) {
			console.log("store init for", payload.p, "payload:", payload, "state:", state)
			//payload.p[payload.prop] = payload.val
			Vue.set(payload.p, payload.prop, payload.val)
		},
		updateValue(state, payload) {
			console.log("store update for", payload.p, "payload:", payload)
			//payload.p[payload.prop] = payload.val
			Vue.set(payload.p, payload.prop, payload.val)
		},
		pushValue(state, payload) {
			console.log("store push for", payload.p, "payload:", payload)
			//payload.p.push()
			//payload.val.push('x')
			//payload.p[payload.prop].push()
			payload.val.push(undefined)
			//let newArr = payload.val
			//newArr.push(undefined)
			//Vue.set(payload.p, payload.prop, newArr)
		},
		popValue(state, payload) {
			payload.val.pop()
		},
		/*
		setValue(state, payload) {
			console.log("store update for", payload.old, "to:", payload.new)
			payload.old = payload.new
		},
		*/
		setState(state, payload) {
			if (!(payload.path in state.vState)) {
				Vue.set(state.vState, payload.path, {
					v: false,
					e: [],
				})
			}
			Vue.set(state.vState, payload.path, {
				v: payload.v,
				e: payload.e,
			})
		},
		resetState(state) {
			Vue.set(state, 'vState', {})
		},
		updateStats(state, payload) {
			state.stats = payload
		},
	},
	getters: {
		getState: (state) => (path) => {
			return state.vState[path]
		},
		uiForPath: (state) => (path) => {
			return state.hints[path.replace(/(\/|^)[0-9]+(\/|$)/g, "$1*$2")] || {}
		},
		uiValidKeywordsList: (state) => {
			//Object.keys(state.UI_VALID_KEYWORDS)
			return state.UI_VALID_KEYWORDS
		},
		uiValidKeywordsSet: (state) => {
			return new Set(state.UI_VALID_KEYWORDS)
		},
	},
})
