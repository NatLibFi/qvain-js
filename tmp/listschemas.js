"use strict";

const SUBSCHEMA_KEYWORDS = {
	// object
	'properties': true,
	'additionalProperties': true,
	// array
	'items': true,
	'additionalItems': true,
}

const _Combiners = {
	'allOf': {},
	'anyOf': {},
	'oneOf': {},
	'not': {},
}

var ObjectKWs = ['properties', 'definitions'] // 'additionalProperties'
var ArrayKWs = ['items', 'additionalItems']

//var SubKWs = Array.prototype.concat(Object.keys(SUBSCHEMA_KEYWORDS), Object.keys(_Combiners), ['definitions'])
//console.log(SubKWs)

var uiHints = {
	'/definitions/Location': {
		'help': "This is the help",
	}
}


function foreachSchema(schema, func) {
	_walkAndDo(schema, "", func)
}

function _walkAndDo(schema, path, func) {
	if (typeof schema !== 'object') throw new Error("schema is not an object: " + path || "/")

	ObjectKWs.forEach(kw => { if (kw in schema) Object.keys(schema[kw]).forEach(sub => _walkAndDo(schema[kw][sub], path + "/" + kw + "/" + sub, func)) })
	if ('additionalProperties' in schema && typeof schema['additionalProperties'] === 'object') _walkAndDo(schema['additionalProperties'], path + "/" + 'additionalProperties', func)
	
	ArrayKWs.forEach(kw => {
		if (kw in schema) {
			if (schema[kw] instanceof Array) {
				schema[kw].forEach(sub => _walkAndDo(schema[kw][sub], path + "/" + kw + "/" + sub, func))
			} else {
				_walkAndDo(schema[kw], path + "/" + kw, func)
			}
		}
	})
	Object.keys(_Combiners).forEach(kw => {
		if (kw in schema) {
			if (schema[kw] instanceof Array) {
				//console.log("diving into array", schema[kw], schema[kw][sub])
				schema[kw].forEach((sub, i) => _walkAndDo(schema[kw][i], path + "/" + kw + "/" + i, func))
			} else {
				_walkAndDo(schema[kw], path + "/" + kw, func)
			}
		}
	})
	
	//Object.keys(_Combiners).forEach(kw => { if (kw in schema) schema[kw].forEach(sub => _walkAndDo(schema[kw][sub], path + "/" + kw + "/" + sub, func) })
	
	func(path, schema['title'], schema['description'])
}

var testschema = { "$schema": "http://json-schema.org/draft-04/schema#", "description": "A geographical coordinate", "type": "object", "properties": { "latitude": { "type": "number" }, "longitude": { "type": "number" } } }
var iow = require("../schema/schema.json")

foreachSchema(testschema, function(p) { console.log(p) })
foreachSchema(iow, function(p, t, d) {
	console.log(p, ", title:", t, ", description:", d)
	if (p in uiHints) {
		console.log("  -wvh- ui:", uiHints[p]['help'])
	}
})
