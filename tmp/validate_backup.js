"use strict";

var test = {
	'a': true,
	'b': true,
	'c': true,
}

//console.log(Object.keys(test).every(x => test[x]))

var testdataGood = { "latitude": 123, "longitude": 666 }
var testdataBad = { "latitude": 123, "extra": "extradata" }

var testschema = { "$schema": "http://json-schema.org/draft-04/schema#", "description": "A geographical coordinate", "type": "object", "properties": { "latitude": { "type": "number" }, "longitude": { "type": "number" } } }

var testschemaNoAdd = { "$schema": "http://json-schema.org/draft-04/schema#", "description": "A geographical coordinate", "type": "object", "properties": { "latitude": { "type": "number" }, "longitude": { "type": "number" } }, "additionalProperties": false }

var testStringData = "HELLO"
var testStringSchema = { "type": "string" }

function isObject(thing) {
	return thing !== null && typeof thing === 'object' && !(thing instanceof String || thing instanceof Array || typeof thing === 'function')
}

var isFinite = Number.isFinite || function(val) {
	return typeof val === 'number' && isFinite(val);
}

var isInteger = Number.isInteger || function(val) {
	return typeof val === "number" &&
	isFinite(val) &&
	Math.floor(val) === val;
}

const SUBSCHEMA_KEYWORDS = {
	// object
	'properties': true,
	'additionalProperties': true,
	// array
	'items': true,
	'additionalItems': true,
}

const _NumericTypes = {
	'keywords': ['multipleOf', 'minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum'],
}

const _Combiners = {
	'allOf': {},
	'anyOf': {},
	'oneOf': {},
	'not': {},
}

const _SchemaKeywords = {
	'title': {},
	'description': {},
	'default': {},
	'type': {},
	'enum': {},
}

const _DocKeywords = {
	'definitions': {
		'parser': {},
	},
	'$schema': {},
}

const _Types = {
	'string': {
		'keywords': ['minLength', 'maxLength', 'pattern', 'format'],
	},
	'integer': _NumericTypes,
	'number': _NumericTypes,
	'object': {
		'keywords': ['properties', 'additionalProperties', 'required', 'minProperties', 'maxProperties', 'dependencies', 'patternProperties'],
	},
	'array': {
		'keywords': ['items', 'additionalItems', 'minItems', 'maxItems', 'uniqueItems'],
	},
	'boolean': {},
	'null': {},
}

function makeKeywordLookup() {
	var kws = {}
	for (let type in _Types) {
		if (!_Types[type]['keywords']) continue;
		
		_Types[type]['keywords'].forEach(kw => kws[kw] = type)
	}
	return kws
}

const _TypeKeywords = makeKeywordLookup()

//console.log("keywords:", _TypeKeywords)

// implement custom errors, so we can separate our own from Javascript's in try/catch handling
function SchemaError(message, path) {
	this.name = 'SchemaError';
	this.message = message || "unspecified error";
	this.path = path || '';
	
	//if (path) this.message += ' at path ' + path
	if (path) this.message += " (ref: " + path + ")"
	
	if (Error.captureStackTrace)
		Error.captureStackTrace(this, this.constructor)
	else
		this.stack = (new Error()).stack;
}
SchemaError.prototype = Object.create(Error.prototype);
SchemaError.prototype.constructor = SchemaError;


function MyError(message) {
	this.name = 'MyError'; // this.constructor.name
	this.message = message || "unspecified error";
	
	if (Error.captureStackTrace) {
		Error.captureStackTrace(this, this.constructor)
	} else {
		this.stack = (new Error()).stack;
	}
	//console.log(this.path)
	//this.toString = function () { return this.name + ': ' + this.message }
}
MyError.prototype = Object.create(Error.prototype);
MyError.prototype.constructor = MyError;
//MyError.prototype.toString = function () { return this.name + ': ' + this.message }


function doesTypeValidate(dataType, schemaTypes) {
	//if (schemaType.some(x => x === 'number')) { schemaType.append('integer') }
	// TODO: optimise: integer = number
	return schemaTypes === undefined || schemaTypes.some(x => x === dataType || x === 'number' && dataType === 'integer') // Array.prototype.includes not supported in IE
}


function createStructure(schema, data) {
	walkSchema(schema, data, {}, data, "")
}

const sentinel = '.'
const createMissingProps = false

function walkSchema(schema, data, out, parent, path) {
	//if (typeof schema !== 'object') throw new SchemaError("schema is not an object", path || "/")
	if (typeof schema !== 'object') throw new SchemaError("schema is not an object", path || "/")
	
	var dataType = getDataType(data)
	var isValue = dataType !== 'object' && dataType !== 'array'
	//var hasChildren = dataType === 'object' && Object.keys(data).some(k => typeof data[k] === 'object' && data[k] !== null)
	//console.log("data has children?", hasChildren, Object.keys(data).map(k => typeof data[k]))
	var schemaTypes = typeof schema['type'] === 'string' ? [schema['type']] : schema['type']
	//var schemaType = schema['type'] instanceof Array ? schema['type'] : [schema['type'] || 'undefined']
	
	var isAnyType = 'type' in schema
	var isValidType = isAnyType || doesTypeValidate(dataType, schemaTypes)

	/*
	if (isValue && !isValidType || path === "/longitude") {
		console.log(testdata, data)
		data = 666
 		parent['longitude'] = 123
		console.log(testdata, data)
	}
	*/
	
	if (!isValidType) {
		schema[sentinel] = false
		console.log("[FAIL] expected:", schemaTypes, "got:", dataType, "for path", path, "schema:", schema)
	}
	
	console.log(path || '/', "datatype:", dataType, "; schematype:", schemaTypes || "any", "; type validates:", isValidType, isValue ? "; data: " + data: "")
	
	
	/*
	for (let subkw in SUBSCHEMA_KEYWORDS) {
		if (subkw in schema) walkSchema(schema[subkw], data, out, path + '/' + subkw)
	}
	*/
	//if (subkw in schema) walkSchema(schema[subkw], data[subkw], out, path + '/' + subkw)
	if (dataType === 'object' && (schemaTypes === undefined || schemaTypes.some(x => x === 'object')) && 'properties' in schema) {
		let addProps = schema['additionalProperties']
		let allowAddProps = addProps !== undefined && typeof addProps === 'boolean' ? addProps : true
		let addPropSchema = addProps !== undefined && isObject(addProps) ? addProps : {}
		
		let dataProps = {}
		if (isObject(data)) Object.keys(data).forEach(k => dataProps[k] = true)
		
		for (let prop in schema['properties']) {
			if (!(prop in data)) {
				// missing property
				if (createMissingProps) {
					data[prop] = undefined
				} else {
					console.log("missing prop:", prop)
				}
				//data[prop] = {}
			}
			dataProps[prop] = false
			walkSchema(schema['properties'][prop], data[prop], out, data, path + '/' + prop)
		}
		
		let restProps = Object.keys(dataProps).filter(k => dataProps[k])
		if (restProps.length > 0) {
			//console.log("unhandled data:", restProps, addProps)
			//console.log(allowAddProps ? "... but that's fine" : "... that's strictly forbidded!")
			if (!allowAddProps) {
				schema[sentinel] = false
				console.log("[FAIL] extra props not allowed:", restProps, "[" + (path || 'root') + "]")
			}
		}
		//if (restProps && Object.keys(addPropSchema).length) {
		if (restProps.length > 0 && allowAddProps) {
			for (let i in restProps) {
				let prop = restProps[i]
				//walkSchema(schema['additionalProperties'], data[prop], out, data, path + '/' + prop)
				walkSchema(addPropSchema, data[prop], out, data, path + '/' + prop)
			}
		}
	}
	
	// string
	if (dataType === 'string' && (schemaTypes === undefined || schemaTypes.some(x => x === 'string'))) {
		schema[sentinel] = true
	}
	
	if (dataType === 'number' && (schemaTypes === undefined || schemaTypes.some(x => x === 'number'))) {
		schema[sentinel] = true
	}
	
	if (dataType === 'integer' && (schemaTypes === undefined || schemaTypes.some(x => x === 'integer'))) {
		schema[sentinel] = true
	}
	
	
}

createStructure(testschemaNoAdd, testdataBad)
//console.log(testschemaNoAdd)
console.log("-- ")
createStructure(testschema, testdataGood)
//console.log(testschema)
console.log("-- ")
//createStructure(testStringData, testStringData)
createStructure(testStringSchema, testStringData)


function parsePath(path) {
	if (path === "") return [];
	if (path[0] !== "/") throw new Error("invalid path:" + path);
	return path.substring(1).split(/\//).map(s => s.replace(/~1/g, '/').replace(/~0/g, '~'));
}


function getPath(obj, path) {
	var els = parsePath(path)
	
	for (var i = 0; i < els.length; ++i) {
		var el = els[i];
		if (!(typeof obj == 'object' && el in obj)) {
			throw new Error('Invalid reference token: ' + el);
		}
		obj = obj[el];
	}
	return obj;
}

function getParent(obj, path) {
	var els = parsePath(path)
	
	console.log("len:", els.length)
	
	for (var i = 0; i < els.length - 1; ++i) {
		var el = els[i];
		if (!(typeof obj == 'object' && el in obj)) {
			throw new Error('Invalid reference token: ' + el);
		}
		obj = obj[el];
	}
	return obj;
}

/*
console.log("path:", parsePath("/longitude"))
console.log("value:", getPath(testdataGood, "/longitude"))
var mod = getPath(testdataGood, "/longitude")
mod = 13
console.log("value:", getPath(testdataGood, "/longitude"))

console.log("parent:", getParent(testdataGood, "/longitude"))
var par = getParent(testdataGood, "/longitude")
par.longitude = 13
console.log("parent:", getParent(testdataGood, "/longitude"))

console.log("value:", getPath(testStringData, ""))
console.log("parent:", getParent(testStringData, ""))
*/

// return the json-schema data type for a given (JSON!) value
function getDataType(thing) {
	if (thing === null) { return 'null' }
	if (thing === undefined) { return 'undefined' }

	var _typeof = typeof thing
	if (_typeof === 'string') { return 'string' }
	if (_typeof === 'object') {
		if (thing instanceof Array) return 'array'
		if (thing instanceof String) return 'string' // JSON should only have primitive strings, but something might happen on the way
		return 'object'
	}
	if (_typeof === 'number') { return isInteger(thing) ? 'integer' : 'number' }
	if (_typeof === 'boolean') { return 'boolean' }

	throw new TypeError("invalid json data type")
}


function isLeaf(schema) {
	if (schema['type'] === 'object') return true;
}

function hasSchemaType(schema, type) {
	if (! 'type' in schema) return undefined;
}
