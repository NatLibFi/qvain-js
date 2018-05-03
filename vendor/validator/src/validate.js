import * as config from './config.js'
import { isObject, isFinite, isInteger } from './is.js'
import { _Types, _Combiners } from './keywords.js'
import SchemaError from './error.js'
import { getDataType, doesTypeValidate } from './data_validators.js'
import { checkValid, addError, resetErrors, setValid } from './validity.js'
import { default as deepcopy } from 'json-deep-copy'
import { default as jsonPointer } from 'json-pointer'
import { foreachSchema } from './walk.js'
import vue from 'vue'

import { validateNumber, validateString, validateBoolean, validateNull, validateObject, validateArray, validateEnum } from './type_validators.js'
import { validateAnyOf, validateAllOf, validateOneOf, validateNot } from './combiners.js'


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
	//this.v = {}
	vue.set(this, 'v', {})
}


Validator.prototype.resetStats = function() {
	this.schemaPass = 0
	this.schemaFail = 0
}


Validator.prototype.checkValid = checkValid
Validator.prototype.addError = addError
Validator.prototype.resetErrors = resetErrors
Validator.prototype.setValid = setValid

Validator.prototype.validateNumber = validateNumber
Validator.prototype.validateString = validateString
Validator.prototype.validateBoolean = validateBoolean
Validator.prototype.validateNull = validateNull
Validator.prototype.validateObject = validateObject
Validator.prototype.validateArray = validateArray
Validator.prototype.validateEnum = validateEnum

Validator.prototype.validateAnyOf = validateAnyOf
Validator.prototype.validateAllOf = validateAllOf
Validator.prototype.validateOneOf = validateOneOf
Validator.prototype.validateNot = validateNot

Validator.prototype.validate = function() {
	//console.log("schema:", this.schema)
	//console.log("data:", this.data)
	return this.validateSchema(this.schema, this.data, "", this, 'data')
}

Validator.prototype.validateData = function(data) {
	return this.validateSchema(this.schema, data, "", this, 'data')
}

// order:
//   deref
//   check correct data type
//   validate enum
//   validate data against schema
Validator.prototype.validateSchema = function(schema, data, path, parent, prop) {
	if (typeof schema !== 'object') throw new SchemaError("schema is not an object", path || "/")

	this.resetErrors(schema)

	//console.log("schema found at path:", path || '(root)')
	//console.log("validateSchema this:", this)
	
	if ('$ref' in schema) {
		this.refCount++
		let ptr = schema['$ref'].substring(schema['$ref'].lastIndexOf("#") + 1);
		//console.log("ref to:", ptr)
		schema['$deref'] = schema['$ref']
		delete schema['$ref']
		//console.log(this.origSchema)
		let clone = jsonPointer.get(this.origSchema, ptr)
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
		this.addError(schema, "invalid data type" + "(got: " + dataType + ", wanted: " + (allowedTypes.join(", ") || "any"))
		//console.log("[FAIL] expected:", allowedTypes, "got:", dataType, "for path", path || "(root)", "schema:", schema)
		// stop checking if data type is not valid according to schema type
		if (data !== undefined) {
			return this.checkValid(schema)
		}
	}
	
	//console.log(path || '/', "datatype:", dataType, "; schematype:", allowedTypes || "any", "; type validates:", isValidType, isValue ? "; data: " + data: "")
	
	//if ('enum' in schema) setValid(schema, validateEnum(schema, data, out, parent, path, _validateSchema))
	//if ('enum' in schema) console.log("found enum:", schema, schema['.q'])
	let enumValid = 'enum' in schema ? this.validateEnum(schema, data, path, parent, prop, this.validateSchema) : true
	//if ('enum' in schema) console.log("enumValid:", enumValid, data)
			
	//console.log("passed enum, datatype:", dataType)
	
	// data type is valid against the types in the schema or there were no types in the schema;
	// call the validators for the data type
	//this.setValid(schema, dataType !== undefined ? enumValid && (_Types[dataType].validator.bind(this))(schema, data, path, parent, prop, this.validateSchema.bind(this)) : false)
	this.setValid(schema, dataType !== undefined ? enumValid && _Types[dataType].validator.call(this, schema, data, path, parent, prop, this.validateSchema.bind(this)) : false)
		
	
	// combiners run in this schema's context so will set an error that will get picked up at the end;
	// the respective schemas inside those combining keywords could be true or false though
	let combinersValid = true
	let self = this
	Object.keys(_Combiners).filter(k => k in schema).forEach(function(kw) {
		//console.log("DEBUG:", kw)
		//if (! (kw in schema)) continue
		//console.log("DEBUG: found combiner:", kw)
		//if (!(_Combiners[kw].validator.bind(this))(schema, data, path, parent, prop, this.validateSchema.bind(this))) {
		if (!_Combiners[kw].validator.call(self, schema, data, path, parent, prop, self.validateSchema.bind(self))) {
			//console.log("DEBUG: combiner failed:", kw)
			combinersValid = false
			//addError("combiner" + kw + "failed")
		}
	})
	
	return this.checkValid(schema)
}


/*
 * function countSchema(schema) {
 *	var foundChild = false
 *	countSchema.o++
 *	if (config.sentinel in schema) schema[config.sentinel]['v'] ? countSchema.t++ : countSchema.f++
 *	if (config.sentinel in schema) countSchema.q++
 *		
 *	for (let key in schema) {
 *		if (key === config.sentinel) continue
 *		if (typeof schema[key] === 'object' && !(schema[key] instanceof Array)) countSchema(schema[key])
 *		if (typeof schema[key] === 'object' && !(schema[key] instanceof Array)) foundChild = true
 *	}
 *	if (!foundChild && !Array.isArray(schema)) {
 *		countSchema.v++
 *	}
 * }
 */

//export { Validator }
export default Validator
