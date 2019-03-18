import Vue from 'vue'
import Vuex from 'vuex'
//import jsonPointer from 'json-pointer'
//import {api as vuePointer} from '../vendor/json-pointer/index.js'
import vuePointer from '../vendor/json-pointer/index.js'
import cloneWithPrune from './lib/cloneWithPrune.js'
//const vuePointer = require('../vendor/json-pointer/index.js').default
//import * as vuePointer from '../vendor/json-pointer/index.js'
import getDotted from 'lodash.get'
import hasDotted from 'lodash.has'

Vue.use(Vuex)

// temporary counter to check how often a getter is called
//let counter = 0

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
			'tab',
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
			Vue.set(state, 'schema', schema)
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
			Vue.set(payload.p, payload.prop, payload.val)
			Vue.nextTick(() => {
				if (payload.val === '') {
					Vue.delete(payload.p, payload.prop)
				}
			})
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
		deleteArrayValue(state, { parent, property, index }) {
			Vue.delete(parent[property], index)
		},
		deleteValue(state, payload) {
			Vue.delete(payload.p, payload.prop)
		},
		addProp(state, payload) {
			Vue.set(payload.val, payload.prop, undefined)
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
		// prunedDataset returns a deep-clone of the dataset discarding empty leaves
		prunedDataset: (state) => {
			return cloneWithPrune(state.record)
		},
		// getState returns the validation state for a given path
		getState: (state) => (path) => {
			return state.vState[path]
		},
		// uiForPath returns the UI overrides for the given path (if any)
		uiForPath: (state) => (path) => {
			return state.hints[path.replace(/(\/|^)[0-9]+(\/|$)/g, "$1*$2")] || {}
		},
		// uiValidKeywordsList returns a static array of valid keywords
		uiValidKeywordsList: (state) => {
			//Object.keys(state.UI_VALID_KEYWORDS)
			return state.UI_VALID_KEYWORDS
		},
		// uiValidKeywordsSet returns a static set of valid keywords
		uiValidKeywordsSet: (state) => {
			return new Set(state.UI_VALID_KEYWORDS)
		},
		// hasPath checks if the given json-pointer path exists
		hasPath: (state) => (path) => {
			return vuePointer.has(state.record, path)
		},
		// getPath gets the value for the given json-pointer path
		getPath: (state) => (path) => {
			return vuePointer.get(state.record, path)
		},
		// hasDataPath checks if the given dotted path exists (see: lodash.has)
		hasDataPath: (state) => (path) => {
			// _.has(object, path)
			return hasDotted(state.record, path)
		},
		// getDataPath gets the value for the given dotted path (see: lodash.get)
		getDataPath: (state) => (path) => {
			// _.get(object, path, [defaultValue])
			return getDotted(state.record, path)
		},
		// getTitle returns the English title or the first one defined
		getTitle: (state) => {
			return state.record && state.record.title && (state.record.title['en'] || state.record.title[Object.keys(state.record.title)[0]] || null)
		},
		// getTitleWithLanguage returns the title for the given language or the first defined
		getTitleWithLanguage: (state) => (lang) => {
			return state.record && state.record.title && (state.record.title[lang] || state.record.title[Object.keys(state.record.title)[0]] || null)
		},
	},
})
