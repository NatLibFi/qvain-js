import * as config from './config.js'
import { isObject, isFinite, isInteger } from './is.js'
import { _Types, _Combiners } from './keywords.js'
import SchemaError from './error.js'
import { getDataType, doesTypeValidate } from './data_validators.js'
import { checkValid, addError, addHelp, resetErrors, setValid } from './validity.js'
import { default as deepcopy } from 'json-deep-copy'
import { default as jsonPointer } from 'json-pointer'
import { foreachSchema } from './walk.js'
import vue from 'vue'

import { validateNumber, validateString, validateBoolean, validateNull, validateObject, validateArray, validateEnum } from './type_validators.js'
import { validateAnyOf, validateAllOf, validateOneOf, validateNot } from './combiners.js'


function Validator(schema, data, options) {
	if (!(this instanceof Validator)) throw new Error("Validator: call constructor with new")

	if (!options) {
		options = {}
	}
	
	this.refCount = 0
	this.schemaCount = -5
	this.schemaPass = 0
	this.schemaFail = 0
	
	this.origSchema = deepcopy(schema)
	//this.schema = schema
	vue.set(this, 'schema', schema)
	this.data = data
	//vue.set(this, 'data', data)
	//this.v = {}
	vue.set(this, 'v', {})

	if (options.createFunc) {
		this.createState = options.createFunc
	} else {
		this.createState = function(path) {
			if (path in this.v) return false
			
			this.v[path] = {
				v: false,
				e: [],
			}
			return true
		}
	}

	if (options.resetFunc) {
		this.resetState = options.resetFunc
	} else {
		this.resetState = function(path) {
			this.v[path].e.splice(0, this.v[path].e.length)
		}
	}
	
	if (options.cb) {
		console.log("!!! set cb:", options.cb)
		this.cb = options.cb
	} else {
		this.cb = null
	}
}


Validator.prototype.resetStats = function() {
	this.schemaPass = 0
	this.schemaFail = 0
}


Validator.prototype.checkValid = checkValid
Validator.prototype.addError = addError
Validator.prototype.addHelp = addHelp
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

	//this.createState(path) || this.resetState(path)
	this.resetErrors(path, schema)
	if (path in this.v) {
		this.v[path].e.splice(0, this.v[path].e.length)
	} else {
		/*
		vue.set(this.v, path, {
			v: false,
			e: [],
		})
		*/
		this.v[path] = {
			v: false,
			e: [],
		}
	}

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
		//let ref = jsonPointer.get(this.origSchema, ptr)
		//let clone = deepCopy(ref)
		for (let key in clone) {
			schema[key] = clone[key]
		}
	}
	
	var dataType = getDataType(data)
	var allowedTypes = typeof schema['type'] === 'string' ? [schema['type']] : schema['type']
	
	var isAnyType = !('type' in schema)
	var isValidType = isAnyType || doesTypeValidate(dataType, allowedTypes)
	
	if (!isValidType) {
		this.addError(path, schema, "invalid data type" + "(got: " + dataType + ", wanted: " + (allowedTypes.join(", ") || "any"))
		// stop checking if data type is not valid according to schema type
		if (data !== undefined) {
			return this.checkValid(path, schema)
		}
	}
	
	//console.log(path || '/', "datatype:", dataType, "; schematype:", allowedTypes || "any", "; type validates:", isValidType, isValue ? "; data: " + data: "")
	
	//if ('enum' in schema) setValid(schema, validateEnum(schema, data, out, parent, path, _validateSchema))
	let enumValid = 'enum' in schema ? this.validateEnum(schema, data, path, parent, prop, this.validateSchema) : true
			
	// data type is valid against the types in the schema or there were no types in the schema;
	// call the validators for the data type
	this.setValid(path, schema, dataType !== undefined ? enumValid && _Types[dataType].validator.call(this, schema, data, path, parent, prop, this.validateSchema.bind(this)) : false)
	
	// combiners run in this schema's context so will set an error that will get picked up at the end;
	// the respective schemas inside those combining keywords could be true or false though
	let combinersValid = true
	let self = this
	Object.keys(_Combiners).filter(k => k in schema).forEach(function(kw) {
		if (!_Combiners[kw].validator.call(self, schema, data, path, parent, prop, self.validateSchema.bind(self))) {
			combinersValid = false
		}
	})

	this.v[path].v = !!this.v[path].e.length
	//if (this.cb) this.cb(path, this.v[path].e, this.v[path].v);
	return this.checkValid(path, schema)
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

export default Validator
