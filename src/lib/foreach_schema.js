"use strict"

/*
const SUBSCHEMA_KEYWORDS = {
	// object
	'properties': true,
	'additionalProperties': true,
	// array
	'items': true,
	'additionalItems': true,
}
*/

const _Combiners = {
	'allOf': {},
	'anyOf': {},
	'oneOf': {},
	'not': {},
}

let ObjectKWs = ['properties', 'definitions'] // 'additionalProperties'
let ArrayKWs = ['items', 'additionalItems']


function foreachSchema(schema, func) {
	_walkAndDo(schema, "", func)
}

function _walkAndDo(schema, path, func, parent, prop) {
	if (typeof schema !== 'object') throw new Error("schema is not an object: " + path || "/")

	ObjectKWs.forEach(kw => { if (kw in schema) Object.keys(schema[kw]).forEach(sub => _walkAndDo(schema[kw][sub], path + "/" + kw + "/" + sub, func, schema[kw], sub)) })
	if ('additionalProperties' in schema && typeof schema['additionalProperties'] === 'object') _walkAndDo(schema['additionalProperties'], path + "/" + 'additionalProperties', func, schema, 'additionalProperties')
	
	ArrayKWs.forEach(kw => {
		if (kw in schema) {
			if (schema[kw] instanceof Array) {
				schema[kw].forEach(sub => _walkAndDo(schema[kw][sub], path + "/" + kw + "/" + sub, func, schema[kw], sub))
			} else {
				_walkAndDo(schema[kw], path + "/" + kw, func, schema, kw)
			}
		}
	})
	Object.keys(_Combiners).forEach(kw => {
		if (kw in schema) {
			if (schema[kw] instanceof Array) {
				//console.log("diving into array", schema[kw], schema[kw][sub])
				schema[kw].forEach((sub, i) => _walkAndDo(schema[kw][i], path + "/" + kw + "/" + i, func, schema[kw], i))
			} else {
				_walkAndDo(schema[kw], path + "/" + kw, func, schema, kw)
			}
		}
	})
	
	//Object.keys(_Combiners).forEach(kw => { if (kw in schema) schema[kw].forEach(sub => _walkAndDo(schema[kw][sub], path + "/" + kw + "/" + sub, func) })
	
	//func(path, schema['title'], schema['description'])
	func(path, parent, prop)
}


function valueAtSchema(schema, func) {
	_walkAndSet(schema, "", func, "0")
}

// eslint-disable-next-line no-unused-vars
const DEPTH_KWS = {
	'properties': {},
	'definitions': {},
	'items': {},
	'allOf': {},
	'anyOf': {},
	'oneOf': {},
}

// eslint-disable-next-line no-unused-vars
const SINGLE_KWS = {
	'additionalProperties': {},
	'not': {},
}
	


function _walkAndSet(schema, path, func, cur) {
	if (typeof schema !== 'object') throw new Error("schema is not an object: " + path || "/")
		
	//var cur = func(path) || cur
	let found = func(path)
	cur = typeof found === 'number' ? found : cur
	
	console.log(path || "root", ":", typeof found === 'number' ? found : "("+cur+")")
	
	// https://stackoverflow.com/questions/34950322/use-of-semicolons-in-es6
	;['properties', 'definitions', 'items', 'allOf', 'anyOf', 'oneOf'].forEach(kw => { if (kw in schema) Object.keys(schema[kw]).forEach(sub => _walkAndSet(schema[kw][sub], path + "/" + kw + "/" + sub, func, cur)) })
	;['additionalProperties', 'not'].forEach(kw => { if (kw in schema && typeof schema[kw] === 'object') _walkAndSet(schema[kw], path + "/" + kw, func, cur) })
}


export { foreachSchema, valueAtSchema }
