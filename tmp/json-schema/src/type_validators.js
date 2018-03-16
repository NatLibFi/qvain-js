import { isObject } from './is.js'
import * as config from './config.js'
import { checkValid, addError } from './validity.js'

var STRING_FORMAT_VALIDATORS = {
	'date-time': function(){},
	'email': function(){},
	'hostname': function(){},
	'ipv4': function(){},
	'ipv6': function(){},
	'uri': function(){},
}

function validateString() { return true }
//function validateInteger() { return true }
function validateNumber() { return true }
function validateObject() { return true }
function validateArray() { return true }
function validateBoolean() { return true }
function validateNull() { return true }
//function validateList() { return true }

function validateString(schema, data, out, parent, path) {
	var min = schema['minLength']
	var max = schema['maxLength']
	
	if (min && max) {
		if (data.length < min || data.length > max) {
			addError(schema, "length must be between " + min + " and " + max + " characters")
		}
	} else {
		if (min && data.length < min) addError(schema, "length must be at least " + min + " characters")
			if (max && data.length > max) addError(schema, "length must be at most " + max + " characters")
	}
	
	// regex
	if ('pattern' in schema) {
		try {
			let re = new RegExp(schema['pattern']);
			if (!re.test(data)) addError(schema, "data doesn't match pattern")
		}
		catch (e) {
			// invalid regex (log?)
		}
	}
	
	// formats not implemented should PASS (http://json-schema.org/latest/json-schema-validation.html#rfc.section.8.1)
	if ('format' in schema) {
		if (schema['format'] in STRING_FORMAT_VALIDATORS) {
			if (!STRING_FORMAT_VALIDATORS[schema['format']](data)) addError(schema, "invalid format for " + schema['format'])
		} else {
			// unknown format, pass (log somewhere?)
		}
	}

	/*
	schema[config.sentinel] = !errors.length
	schema[config.errormsg] = errors
	return schema[config.sentinel]
	*/
	return checkValid(schema)
}

function validateNumber(schema, data, out, parent, path) {
	const opMore = (a, b) => a > b
	const opMoreOrEqual = (a, b) => a >= b
	var type = schema['type'] // number or integer
	var errors = []
	
	// double-check and short-circuit to avoid doing arithmetics with something that's not a number
	if (typeof data !== 'number') {
		addError(schema, "not a number")
		return checkValid(schema)
	}

	//var min = schema['minimum']
	//var max = schema['maximum']
	//var isMinExclusive = Boolean(schema['exclusiveMinimum'])
	//var isMaxExclusive = Boolean(schema['exclusiveMaximum'])
	//var minOp = Boolean(schema['exclusiveMinimum']) ? (a, b) => a > b : (a, b) => a >= b
	if ('minimum' in schema) {
		if (! (Boolean(schema['exclusiveMinimum']) ? opMore : opMoreOrEqual)(data, schema['minimum']) ) addError(schema, "number out of range (minimum)")
	}
	if ('maximum' in schema) {
		if (! (Boolean(schema['exclusiveMaximum']) ? opMore : opMoreOrEqual)(schema['maximum'], data) ) addError(schema, "number out of range (maximum)")
	}
		
	if ('multipleOf' in schema) {
		if (data % schema['multipleOf']) {
			addError(schema, data + " is not a multiple of " + schema['multipleOf'])
		}
	}

	return checkValid(schema)
}


// Schema dependencies might change the schema conditionally; make a deepmerge copy if this is the case.
// Refer to `origSchema` for returned values (i.e. parent), and work with and pass the updated `schema` down the tree (i.e. children).
// This way the actual schema is not modified and we can test again even if the conditions (and hence the copy) change.
function validateObject(schema, data, out, parent, path, recurse) {
	// copy ref in case we need to make a copy
	var origSchema = schema
	var merge = require('deepmerge')
	
	let depProps = {}
	for (let prop in schema['dependencies']) {
		//schema['dependencies'][prop].forEach(dep => depProps[prop] = 'dep of ' + prop)
		//depProps[prop] = schema['dependencies'][prop].reduce(dep => { return {dep: 'dep of ' + prop} }, {})
		// schema dependency, merge schema and extra requirements into new schema copy
		if (!Array.isArray(schema['dependencies'][prop])) {
			console.log("TEST: schema dependency; merge:", prop in data)
			if (prop in data) schema = merge(schema, schema['dependencies'][prop])
			//console.log(schema)
		} else {
			depProps[prop] = schema['dependencies'][prop].reduce((res, dep) => { res[dep] = 'dep of ' + prop; return res; }, {})
		}
	}
	
	let addProps = schema['additionalProperties']
	let allowAddProps = addProps !== undefined && typeof addProps === 'boolean' ? addProps : true
	let addPropSchema = addProps !== undefined && typeof addProps === 'object' ? addProps : {}
	
	let reqProps = schema['required'] ? schema['required'].reduce((res, item) => { res[item] = true; return res; }, {}) : {}
	/*
	if ('dependencies' in schema) {
		for (let prop in schema['dependencies']) {
			schema['dependencies'][prop].forEach(dep => reqProps[dep] = 'dep of ' + prop)
		}
	}
	*/
	
	if ('properties' in schema) {
		let dataProps = {}
		if (isObject(data)) Object.keys(data).forEach(k => dataProps[k] = true)
		
		let numProps = Object.keys(dataProps).length
		if ('minProperties' in schema && numProps < schema['minProperties']) addError(origSchema, "too few properties (got " + numProps + ", need at least " + schema['minProperties'] + ")")
		if ('maxProperties' in schema && numProps > schema['maxProperties']) addError(origSchema, "too many properties (got " + numProps + ", need at most " + schema['maxProperties'] + ")")
			
		for (let prop in schema['properties']) {
			// -wvh- functionality for empty data, check relevance in validation
			if (!(prop in data)) {
				// missing property
				if (config.createMissingProps) {
					data[prop] = undefined
				} else {
					console.log("[IGNORE] unset prop:", prop)
				}
				//data[prop] = {}
			}
			if (prop in data) {
				//console.log("DEBUG:", prop)
				dataProps[prop] = false
				if (prop in depProps) console.log("dependencies:", depProps[prop])
				for (let dep in depProps[prop]) {
					if (! (dep in data)) addError(origSchema, "missing prop: " + dep + " (dependency of " + prop + ")")
				}
				if (!recurse(schema['properties'][prop], data[prop], out, data, path + '/' + prop)) addError(origSchema, "failed prop: " + prop)
			} else {
				//console.log("TEST:", prop, " = ", prop in reqProps)
				if (prop in reqProps) addError(origSchema, "missing prop: " + prop)
				//console.log(schema['.q'])
				//else console.log("missing prop (not required): " + prop)
			}
		}
		
		let restProps = Object.keys(dataProps).filter(k => dataProps[k])
		if (restProps.length > 0) {
			//console.log("unhandled data:", restProps, addProps)
			//console.log(allowAddProps ? "... but that's fine" : "... that's strictly forbidded!")
			if (!allowAddProps) {
				//schema[sentinel] = false
				addError(origSchema, "extra properties not allowed: " + restProps.join(", "))
				console.log("[FAIL] extra props not allowed:", restProps, "[" + (path || 'root') + "]")
			}
		}
		//if (restProps && Object.keys(addPropSchema).length) {
		if (restProps.length > 0 && allowAddProps) {
			for (let i in restProps) {
				let prop = restProps[i]
				//_validateSchema(schema['additionalProperties'], data[prop], out, data, path + '/' + prop)
				if (!recurse(addPropSchema, data[prop], out, data, path + '/' + prop)) addError(origSchema, "failed prop: " + prop)
			}
		}
		
	}
	//console.log(schema['.q'])
	//console.log(origSchema['.q'])
	
	return checkValid(origSchema)
}


function validateBoolean(schema, data, out, parent, path, recurse) {
	if (typeof data !== 'boolean') addError(schema, "not a boolean value")
	return checkValid(schema)
}


function validateNull(schema, data, out, parent, path, recurse) {
	if (! (typeof data === 'object' && data === null)) addError(schema, "not null")
	return checkValid(schema)
}



function doesTypeValidate(dataType, allowedTypes) {
	//if (schemaType.some(x => x === 'number')) { schemaType.append('integer') }
	// TODO: optimise: integer = number
	return allowedTypes === undefined || allowedTypes.some(x => x === dataType || x === 'number' && dataType === 'integer') // Array.prototype.includes not supported in IE
}

export { validateNumber, validateString, validateBoolean, validateNull, validateObject, validateArray }
