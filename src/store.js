import Vue from 'vue'
import Vuex from 'vuex'
//import jsonPointer from 'json-pointer'
//import {api as vuePointer} from '../vendor/json-pointer/index.js'
import vuePointer from '../vendor/json-pointer/index.js'
import cloneWithPrune from './lib/cloneWithPrune.js'
//const vuePointer = require('../vendor/json-pointer/index.js').default
//import * as vuePointer from '../vendor/json-pointer/index.js'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		record: undefined,
		dataset: {},
		schema: {},
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
			//state.record = record
			Vue.set(state, 'record', record)
		},
		mergeData(state, payload) {
			for (let key in payload) {
				Vue.set(state.record, key, payload[key])
			}
		},
		loadSchema(state, schema) {
			//state.schema = schema
			//state.schema = Vue.set(state, 'schema', undefined)
			Vue.set(state, 'schema', schema)
			//Object.assign(state.schema, schema)
		},
		changeSchema(state) {
			//state.schema.properties.creator.description = "I changed it!"
			//delete state.schema.properties.creator
			//Vue.delete(state.schema, 'properties')
			Vue.delete(state.schema.properties, 'creator')
			//Vue.set(state.schema.properties, 'creature', "frankenstein")
			//Vue.set(state, 'schema', {})
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
			//console.log("store init for", payload.p, "payload:", payload, "state:", state)
			//payload.p[payload.prop] = payload.val
			Vue.set(payload.p, payload.prop, payload.val)
		},
		updateValue(state, payload) {
			//console.log("store update for", payload.p, "payload:", payload)
			//payload.p[payload.prop] = payload.val
			Vue.set(payload.p, payload.prop, payload.val)
		},
		updateArrayValue(state, payload) {
			const index = payload.p[payload.prop].findIndex(x => x[payload.search.field] === payload.search.value)
			Vue.set(payload.p[payload.prop], index, payload.val)
		},
		pushValue(state, payload) {
			//console.log("store push for", payload.p, "payload:", payload)
			payload.p[payload.prop].push(payload.val)
		},
		pushMultiple(state, payload) {
			//console.log('store push for', payload.p, 'payload:', payload)
			payload.p[payload.prop].push(...payload.val)
		},
		popValue(state, payload) {
			payload.p[payload.prop].pop()
		},
		removeValue(state, payload) {
			const index = payload.p[payload.prop].findIndex(single => single.identifier === payload.val)
			payload.p[payload.prop].splice(index, 1)
		},
		deleteArrayValue(state, payload) {
			payload.array.splice(payload.index, 1)
		},
		setPath(state, payload) {
			/*
			if (state.dataset === undefined) {
				state.dataset = {}
			}
			*/
			//jsonPointer.set(state.dataset, payload.path, payload.value)
			//var obj = jsonPointer.get(state.dataset, payload.path)
			//Vue.set(obj,
			//Vue.set(state.dataset['rights_holder'], 'identifier', payload.value)
			console.log("setPath:", payload.path)
			vuePointer.set(state.dataset, payload.path, payload.value)
		},

		/*
		setValue(state, payload) {
			console.log("store update for", payload.old, "to:", payload.new)
			payload.old = payload.new
		},
		*/
		setState(state, payload) {
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
		initStateFor(state, path) {
			if (!state.vState[path]) {
				Vue.set(state.vState, path, {e: [], v: null})
			}
		},
		cleanStateFor(state, path) {
			Vue.delete(state.vState, path)
		},
	},
	getters: {
		prunedDataset: (state) => {
			return cloneWithPrune(state.record)
		},
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
		hasPath: (state) => (path) => {
			return vuePointer.has(state.dataset, path)
		},
		getPath: (state) => (path) => {
			console.log("getPath for", path)
			/*
			if (!vuePointer.has(state.dataset, path)) {
				//jsonPointer.set(state.dataset, path, "")
				//Vue.set(state, 'dataset', state.dataset)
				//Vue.set(state.dataset, 'rights_holder', {})
				//Vue.set(state.dataset['rights_holder'], 'identifier', "")
				console.log("getPath: not set", path)
				//vuePointer.set(state.dataset, path, "")

			}
			if (vuePointer.has(state.dataset, path)) {
				console.log("getPath: set now", path)
			}
			*/
			return vuePointer.get(state.dataset, path)
		},
		cachedPath: (state) => {
			const localCache = {}
			return (path) => {
				if (localCache[path]) {
					console.log("from cache", path)
					return localCache[path]
				}
				console.log("from store", path)
				let tmp = vuePointer.get(state.dataset, path)
				localCache[path] = tmp
				return tmp
			}
		},
	},
})
