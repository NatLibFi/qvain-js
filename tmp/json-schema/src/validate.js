import * as config from './config.js'
import { isObject, isFinite, isInteger } from './is.js'
import { _Types } from './keywords.js'
import SchemaError from './error.js'
import { getDataType, doesTypeValidate } from './data_validators.js'
import { checkValid, addError, setValid } from './validity.js'


function cleanSchema(schema) {
	for (let key in schema) {
		if (typeof schema[key] === 'object') cleanSchema(schema[key])
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
		if (typeof schema[key] === 'object') countSchema(schema[key])
		if (typeof schema[key] === 'object') foundChild = true
	}
	if (!foundChild && !Array.isArray(schema)) {
		countSchema.v++
	}
}


function _validateSchema(schema, data, out, parent, path) {
	if (typeof schema !== 'object') throw new SchemaError("schema is not an object", path || "/")
		
	var dataType = getDataType(data)
	var isValue = dataType !== 'object' && dataType !== 'array'
	var allowedTypes = typeof schema['type'] === 'string' ? [schema['type']] : schema['type']
	
	var isAnyType = !('type' in schema)
	var isValidType = isAnyType || doesTypeValidate(dataType, allowedTypes)
	
	if (!isValidType) {
		addError(schema, "invalid data type" + "(got: " + dataType + ", wanted: " + (allowedTypes.join(", ") || "any"))
		console.log("[FAIL] expected:", allowedTypes, "got:", dataType, "for path", path, "schema:", schema)
		// stop checking if data type is not valid according to schema type
		return checkValid(schema)
	}
	
	//console.log(path || '/', "datatype:", dataType, "; schematype:", allowedTypes || "any", "; type validates:", isValidType, isValue ? "; data: " + data: "")
	
	// data type is valid against the types in the schema or there were no types in the schema;
	// call the validators for the data type
	setValid(schema, dataType !== undefined ? _Types[dataType].validator(schema, data, out, parent, path, _validateSchema) : false)
	
	return checkValid(schema)
}


function validateSchema(schema, data) {
	if (config.sentinel in schema) cleanSchema(schema)
	console.log("validates:", _validateSchema(schema, data, {}, data, ""))
	console.log("errors:", schema[config.sentinel].e)
	countSchema.o = 0 // all nested objects
	countSchema.q = 0 // all q's
	countSchema.v = 0 // all values
	countSchema.t = 0 // all true q's
	countSchema.f = 0 // all false q's
	countSchema(schema)
	console.log("complete:", countSchema.t + "/" + (countSchema.t+countSchema.f), "(q:" + countSchema.q + " t:" + countSchema.t + " f:" + countSchema.f + " v:" + countSchema.v + " o:" + countSchema.o + ")")
}

export { validateSchema }
