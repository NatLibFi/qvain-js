import * as config from './config.js'
import { isObject, isFinite, isInteger } from './is.js'
import { _Types, _Combiners } from './keywords.js'
import SchemaError from './error.js'
import { getDataType, doesTypeValidate } from './data_validators.js'
import { validateEnum } from './type_validators.js'
import { checkValid, addError, setValid } from './validity.js'
import { default as deepcopy } from 'json-deep-copy'
import { default as jsonPointer } from 'json-pointer'
import { foreachSchema } from './walk.js'
import vue from 'vue'

function cleanSchema(schema) {
	for (let key in schema) {
		if (typeof schema[key] === 'object' && schema[key] !== null) cleanSchema(schema[key])
	}
	delete schema[config.sentinel]
}

function countSchema(schema) {
	var foundChild = false
	countSchema.o++
	if (config.sentinel in schema) schema[config.sentinel]['v'] ? countSchema.t++ : countSchema.f++
	if (config.sentinel in schema) countSchema.q++
		
	for (let key in schema) {
		if (key === config.sentinel) continue
		if (typeof schema[key] === 'object' && !(schema[key] instanceof Array)) countSchema(schema[key])
		if (typeof schema[key] === 'object' && !(schema[key] instanceof Array)) foundChild = true
	}
	if (!foundChild && !Array.isArray(schema)) {
		countSchema.v++
	}
}


// order:
//   deref
//   check correct data type
//   validate enum
//   validate data against schema
function _validateSchema(schema, data, out, parent, path) {
	//console.log("wvh schema2:", this.schema, this.schemaCount)
	if (typeof schema !== 'object') throw new SchemaError("schema is not an object", path || "/")

	//console.log("schema found at path:", path || '(root)')
		
	//if (!_validateSchema.baseSchema) _validateSchema.baseSchema = deepcopy(schema)
	if ('$ref' in schema) {
		_validateSchema.refCount++
		let ptr = schema['$ref'].substring(schema['$ref'].lastIndexOf("#") + 1);
		console.log("ref to:", ptr)
		schema['$deref'] = schema['$ref']
		delete schema['$ref']
		//let ref = getPath(this.baseSchema, ptr)
		//let clone = jsonPointer.get(this.baseSchema, ptr)
		let clone = jsonPointer.get(_validateSchema.baseSchema, ptr)
		for (let key in clone) {
			schema[key] = clone[key]
		}
	}
	
	var dataType = getDataType(data)
	//var isValue = dataType !== 'object' && dataType !== 'array'
	var allowedTypes = typeof schema['type'] === 'string' ? [schema['type']] : schema['type']

	var isAnyType = !('type' in schema)
	var isValidType = isAnyType || doesTypeValidate(dataType, allowedTypes)
	//console.log("debug:", path, allowedTypes, isValidType)
	
	if (!isValidType) {
		addError(schema, "invalid data type" + "(got: " + dataType + ", wanted: " + (allowedTypes.join(", ") || "any"))
		//console.log("[FAIL] expected:", allowedTypes, "got:", dataType, "for path", path || "(root)", "schema:", schema)
		// stop checking if data type is not valid according to schema type
		if (data !== undefined) {
			return checkValid(schema)
		}
	}
	
	//console.log(path || '/', "datatype:", dataType, "; schematype:", allowedTypes || "any", "; type validates:", isValidType, isValue ? "; data: " + data: "")
	
	//if ('enum' in schema) setValid(schema, validateEnum(schema, data, out, parent, path, _validateSchema))
	if ('enum' in schema) console.log("found enum:", schema, schema['.q'])
	let enumValid = 'enum' in schema ? validateEnum(schema, data, out, parent, path, _validateSchema) : true
	if ('enum' in schema) console.log("enumValid:", enumValid, data)

	//console.log("passed enum, datatype:", dataType)

	// data type is valid against the types in the schema or there were no types in the schema;
	// call the validators for the data type
	setValid(schema, dataType !== undefined ? enumValid && _Types[dataType].validator(schema, data, out, parent, path, _validateSchema) : false)
	
	// combiners run in this schema's context so will set an error that will get picked up at the end;
	// the respective schemas inside those combining keywords could be true or false though
	let combinersValid = true
	Object.keys(_Combiners).filter(k => k in schema).forEach(function(kw) {
		//console.log("DEBUG:", kw)
		//if (! (kw in schema)) continue
		//console.log("DEBUG: found combiner:", kw)
		if (!_Combiners[kw].validator(schema, data, out, parent, path, _validateSchema)) {
			//console.log("DEBUG: combiner failed:", kw)
			combinersValid = false
			//addError("combiner" + kw + "failed")
		}
	})
	
	return checkValid(schema)
}



function makeErrorObject(schema, path) {
	
}


/*
var Validator = {
	refCount: 0,
	schemaCount: 0,
	schemaPass: 0,
	schemaFail: 0,
	validate: _validateSchema,
	
*/

function Validator(schema, data) {
	if (!(this instanceof Validator)) throw new Error("Validator: call constructor with new")
	
	this.refCount = 0
	this.schemaCount = -5
	this.schemaPass = 0
	this.schemaFail = 0
	
	this.origSchema = deepcopy(schema)
	//this.schema = schema
	vue.set(this, 'schema', schema)
	//this.data = data
	vue.set(this, 'data', data)
	this.errors = {}
	this._validateSchema = _validateSchema
	//this.validateObject =
	//return Validator
}


Validator.prototype.resetStats = function() {
	this.schemaPass = 0
	this.schemaFail = 0
}


Validator.prototype.validate = function() {
	//console.log("schema:", this.schema)
	//console.log("data:", this.data)
	return this._validateSchema(this.schema, this.data, {}, this.data, "")
}



function SchemaValidator(schema, data) {
	if (config.sentinel in schema) cleanSchema(schema)
	
	//var start = new Date();
	_validateSchema.refCount = 0
	_validateSchema.baseSchema = deepcopy(schema)
	//SchemaValidator.schema = schema

	console.log("validates:", _validateSchema(schema, data, {}, data, ""))
	
	//var end = new Date();
	//var millisecondsElapsed = end - start;
	//console.log("msecs:", millisecondsElapsed)

	countSchema.o = 0 // all nested objects
	countSchema.q = 0 // all q's
	countSchema.v = 0 // all values
	countSchema.t = 0 // all true q's
	countSchema.f = 0 // all false q's
	countSchema(schema)

	SchemaValidator.o = countSchema.o
	SchemaValidator.q = countSchema.q
	SchemaValidator.v = countSchema.v
	SchemaValidator.t = countSchema.t
	SchemaValidator.f = countSchema.f

	return SchemaValidator
}




function validateSchema(schema, data) {
	if (config.sentinel in schema) cleanSchema(schema)
	
	var start = new Date();
	_validateSchema.refCount = 0
	_validateSchema.baseSchema = deepcopy(schema)
	console.log("validates:", _validateSchema(schema, data, {}, data, ""))
	var end = new Date();
	var millisecondsElapsed = end - start;
	console.log("msecs:", millisecondsElapsed)
	
	console.log("errors:", schema[config.sentinel].e)
	countSchema.o = 0 // all nested objects
	countSchema.q = 0 // all q's
	countSchema.v = 0 // all values
	countSchema.t = 0 // all true q's
	countSchema.f = 0 // all false q's
	countSchema(schema)
	console.log("complete:", countSchema.t + "/" + (countSchema.t+countSchema.f), "(q:" + countSchema.q + " t:" + countSchema.t + " f:" + countSchema.f + " v:" + countSchema.v + " o:" + countSchema.o + ")")
}

export { validateSchema, SchemaValidator, Validator }
