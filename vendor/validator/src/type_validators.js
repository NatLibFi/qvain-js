import { isObject } from './is.js'
import * as config from './config.js'
import { default as deepcopy } from 'json-deep-copy'
import { default as deepequal } from 'deep-equal'

const STRING_FORMAT_VALIDATORS = {
	'date-time': function(){},
	'email': function(email) { return email && email.indexOf('@') > 0 },
	'hostname': function(){},
	'ipv4': function(){},
	'ipv6': function(){},
	'uri': function(uri) { return uri && uri.indexOf(':') > 0 },
}


function validateString(schema, data, path, parent, prop) {
	const min = schema['minLength']
	const max = schema['maxLength']

	if (min && max) {
		if (data.length < min || data.length > max) {
			this.addError(path, schema, "length must be between " + min + " and " + max + " characters")
		}
	} else {
		if (min && data.length < min) this.addError(path, schema, "length must be at least " + min + " characters")
		if (max && data.length > max) this.addError(path, schema, "length must be at most " + max + " characters")
	}
	
	// regex
	if ('pattern' in schema) {
		try {
			let re = new RegExp(schema['pattern']);
			if (!re.test(data)) this.addError(path, schema, "data doesn't match pattern")
		}
		catch (e) {
			// invalid regex (log?)
		}
	}
	
	// formats not implemented should PASS (http://json-schema.org/latest/json-schema-validation.html#rfc.section.8.1)
	if ('format' in schema) {
		if (schema['format'] in STRING_FORMAT_VALIDATORS) {
			if (!STRING_FORMAT_VALIDATORS[schema['format']](data)) this.addError(path, schema, "invalid format for " + schema['format'])
		} else {
			// unknown format, pass (log somewhere?)
		}
	}

	return this.checkValid(path, schema)
}


function validateNumber(schema, data, path, parent, prop) {
	const opMore = (a, b) => a > b
	const opMoreOrEqual = (a, b) => a >= b
	const type = schema['type'] // number or integer
	
	// double-check and short-circuit to avoid doing arithmetics with something that's not a number
	if (typeof data !== 'number') {
		this.addError(path, schema, "not a number")
		return this.checkValid(path, schema)
	}

	if ('minimum' in schema) {
		if (! (Boolean(schema['exclusiveMinimum']) ? opMore : opMoreOrEqual)(data, schema['minimum']) ) this.addError(path, schema, "number out of range (minimum)")
	}
	if ('maximum' in schema) {
		if (! (Boolean(schema['exclusiveMaximum']) ? opMore : opMoreOrEqual)(schema['maximum'], data) ) this.addError(path, schema, "number out of range (maximum)")
	}
		
	if ('multipleOf' in schema) {
		if (data % schema['multipleOf']) {
			this.addError(path, schema, data + " is not a multiple of " + schema['multipleOf'])
		}
	}

	return this.checkValid(path, schema)
}


// Schema dependencies might change the schema conditionally; make a deepmerge copy if this is the case.
// Refer to `origSchema` for returned values (i.e. parent), and work with and pass the updated `schema` down the tree (i.e. children).
// This way the actual schema is not modified and we can test again even if the conditions (and hence the copy) change.
function validateObject(schema, data, path, parent, prop, recurse) {
	// copy ref in case we need to make a copy
	const origSchema = schema
	var merge = require('deepmerge')
	
	let depProps = {}
	for (let prop in schema['dependencies']) {
		// schema dependency, merge schema and extra requirements into new schema copy
		if (!Array.isArray(schema['dependencies'][prop])) {
			if (prop in data) schema = merge(schema, schema['dependencies'][prop])
		} else {
			depProps[prop] = schema['dependencies'][prop].reduce((res, dep) => { res[dep] = 'dep of ' + prop; return res; }, {})
		}
	}
	
	let addProps = schema['additionalProperties']
	let allowAddProps = addProps !== undefined && typeof addProps === 'boolean' ? addProps : true
	let addPropSchema = addProps !== undefined && typeof addProps === 'object' ? addProps : {}
	let reqProps = schema['required'] ? schema['required'].reduce((res, item) => { res[item] = true; return res; }, {}) : {}
	
	if ('properties' in schema) {
		let dataProps = {}
		if (isObject(data)) Object.keys(data).forEach(k => dataProps[k] = true)
			
		let numProps = Object.keys(dataProps).length
		if ('minProperties' in schema && numProps < schema['minProperties']) this.addError(path, origSchema, "too few properties (got " + numProps + ", need at least " + schema['minProperties'] + ")")
		if ('maxProperties' in schema && numProps > schema['maxProperties']) this.addError(path, origSchema, "too many properties (got " + numProps + ", need at most " + schema['maxProperties'] + ")")
			
		for (let prop in schema['properties']) {
			// -wvh- functionality for empty data, check relevance in validation
			/*
			if (!(prop in data)) {
				// missing property
				if (config.createMissingProps) {
					data[prop] = undefined
				} else {
					console.log("[IGNORE] unset prop:", prop)
				}
				//data[prop] = {}
			}
			*/
			if (prop in data) {
				//console.log("DEBUG:", prop)
				dataProps[prop] = false
				//if (prop in depProps) console.log("dependencies:", depProps[prop])
				for (let dep in depProps[prop]) {
					if (!(dep in data)) this.addError(path, origSchema, "missing prop: " + dep + " (dependency of " + prop + ")")
				}
				if (!recurse(schema['properties'][prop], data[prop], path + '/properties/' + prop, data, prop)) this.addError(path, origSchema, "failed prop: " + prop)
			} else {
				if (prop in reqProps) this.addError(path, origSchema, "missing prop: " + prop)
				//else console.log("missing prop (not required): " + prop)
			}
		}
		
		let restProps = Object.keys(dataProps).filter(k => dataProps[k])
		if (restProps.length > 0) {
			if (allowAddProps) {
				for (let i in restProps) {
					let prop = restProps[i]
					if (!recurse(deepcopy(addPropSchema), data[prop], path + '/properties/' + prop, data, prop)) this.addError(path, origSchema, "failed prop: " + prop)
				}
			} else {
				this.addError(path, origSchema, "extra properties not allowed: " + restProps.join(", "))
			}
		}
	}

	return this.checkValid(path, origSchema)
}


function validateArray(schema, data, path, parent, prop, recurse) {
	// top caller handles type
	//if (typeof data !== 'object' || (!(data instanceof Array))) { addError(path, schema, "not an array") }
	
	// no schema restrictions, thus valid
	//if (typeof schema['items'] !== 'object') return checkValid(path, schema)
	if ('items' in schema && typeof schema['items'] !== 'object') throw new SchemaError("items (in array type) is not an object", path || "/")
	
	// list or tuple validation?
	var asTuple = schema['items'] instanceof Array
	
	if (!asTuple) {
		// list validation
		for (let i in data) {
			let itemSchema = 'items' in schema ? deepcopy(schema['items']) : {}
			if (!recurse(itemSchema, data[i], path + '/' + i, data, i, recurse)) this.addError(path, schema, "list validation failed for item: " + i + "data: " + data[i] + "(" + typeof data[i] + ")")
		}
		//if (!data.every((el, i) => recurse(schema['items'], data[i], out, data, path + '/' + i, recurse))) addError(path, schema, "array failed list validation")
	} else {
		// tuple validation
		let allowAddItems = schema['additionalItems'] !== false
		let addItemSchema = typeof schema['additionalItems'] === 'object' ? schema['additionalItems'] : {}
		
		if (!allowAddItems && schema['items'].length < data.length) {
			this.addError(path, schema, "additional items not allowed in array")
			//return checkValid(path, schema)
		}
		
		for (let i in data) {
			/*
			if (typeof schema['items'][i] !== 'object') {
				addError(path, schema, "[schema error] tuple validation failed for item: " + i)
				return checkValid(path, schema)
			}
			*/
			let itemSchema = i < schema['items'].length ? schema['items'][i] : deepcopy(addItemSchema)
			if (!recurse(itemSchema, data[i], path + '/' + i, data, i, recurse)) this.addError(path, schema, "tuple validation failed for index: " + i)
		}
	}

	// minItems and maxItems
	if (typeof schema['minItems'] === 'number' && data.length < schema['minItems']) this.addError(path, schema, "too few items in array")
	if (typeof schema['maxItems'] === 'number' && data.length > schema['maxItems']) this.addError(path, schema, "too many items in array")
	
	// TODO: optimise (use Set or short-circuit)
	// see also: https://stackoverflow.com/questions/1960473/unique-values-in-an-array
	if (schema['uniqueItems'] === true) {
		//var unique = data.filter((v, i, a) => a.indexOf(v) === i)
		//if (data.length > unique.length) addError(path, schema, "array contains non-unique items")
		let shittySet = {}
		if (data.some(e => e in shittySet || shittySet[e]++ )) this.addError(path, schema, "list contains duplicates")
		//console.log(shittySet)
	}
	return this.checkValid(path, schema)
}


function validateEnum(schema, data, path, parent, prop, recurse) {
	//if (typeof schema['enum'] !== 'object' || (!(schema['enum'] instanceof Array))) { addError(path, schema, "not an array") }
	if (schema['enum'].length <= 0) { this.addError(path, schema, "value not in enum") }
	
	if (!schema.enum.some(el => deepequal(el, data))) {
		this.addError(path, schema, "value not in enum")
		//console.log("addHelp:", schema.enum.map(x => typeof x === 'object' && x !== null ? JSON.stringify(x) : String(x)).join('|'))
		this.addHelp(path, schema.enum.map(x => typeof x === 'object' && x !== null ? JSON.stringify(x) : String(x)).join('|'))
	}
	return this.checkValid(path, schema)
}


function validateBoolean(schema, data, path, parent, prop, recurse) {
	if (typeof data !== 'boolean') addError(path, schema, "not a boolean value")
	return this.checkValid(path, schema)
}


function validateNull(schema, data, path, parent, prop, recurse) {
	if (! (typeof data === 'object' && data === null)) this.addError(path, schema, "not null")
	return this.checkValid(path, schema)
}


export { validateNumber, validateString, validateBoolean, validateNull, validateObject, validateArray, validateEnum }
